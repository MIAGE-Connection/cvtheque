import { CandidatureKind, CompetenceType } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { RouterInput, RouterOutput, trpc } from 'utils/trpc'
import { dateToInputDate } from 'utils/utils'

export type Props = {
  initialValues?: AddCandidatureInput
}

export type AddCandidatureInput = RouterInput['candidature']['add'] & {
  userEmail: string
}

export type Candidature = Partial<RouterOutput['candidature']['list'][number]>

/**
 * @description get the same array with startAt and endAt as Date
 * @param argument array of experiences, schools or experiencesAsso
 * @returns the same array with startAt and endAt as Date and missions as object of mission
 */
export const getAdaptedInput = <T,>(
  argument:
    | AddCandidatureInput['experiences']
    | AddCandidatureInput['schools']
    | AddCandidatureInput['experiencesAsso']
    | RouterOutput['candidature']['getByUser']['experiences']
    | RouterOutput['candidature']['getByUser']['schools']
    | RouterOutput['candidature']['getByUser']['ExperienceAsso'],
): T => {
  const values = argument?.map((arg) => {
    const value = {
      ...arg,
      startAt: dateToInputDate(new Date(arg.startAt || '')),
      ...(arg.endAt && arg.endAt.toString() !== ''
        ? {
            endAt: dateToInputDate(new Date(arg.endAt || '')),
          }
        : { endAt: null }),
    }
    if ('missions' in value) {
      return {
        ...value,
        missions: value.missions.map((mission) => {
          // Check if mission is an object
          if (typeof mission === 'object') {
            return {
              ...mission,
            }
          }

          // If mission is a string, return it as an object

          return {
            mission,
          }
        }),
      }
    }

    return value
  })

  return values as unknown as T
}

/**
 * Return the candidature adapted to the details view
 * @param candidature the candidature to adapt, coming from 2 context: getByUser or details
 * @returns Adapter Candidature for the details view
 */
export const getAdaptedCandidature = (
  candidature:
    | RouterOutput['candidature']['getByUser']
    | RouterOutput['candidature']['details'],
): AddCandidatureInput => {
  const experiences = getAdaptedInput<AddCandidatureInput['experiences']>(
    candidature.experiences,
  )
  const experiencesAsso = getAdaptedInput<AddCandidatureInput['experiencesAsso']>(
    candidature.ExperienceAsso,
  )
  const schools = getAdaptedInput<AddCandidatureInput['schools']>(candidature.schools)
  return {
    ...candidature,
    userEmail: '',
    email: 'mail@preview.com',
    experiences: experiences,
    experiencesAsso: experiencesAsso,
    schools: schools,
  }
}

/**
 * @description Custom hook to handle the form of the candidature
 * @param initialValues the initial values of the form
 * @param setVisible function to set the visibility of the multi-select input
 * @returns all the methods and values needed to handle the form
 */
export const useCandidatureForm = ({
  initialValues,
  setVisible,
}: Props & { setVisible: Dispatch<SetStateAction<boolean>> }) => {
  const resolver: Resolver<AddCandidatureInput> = async (values) => {
    return {
      values: values.firstName ? values : {},
      errors: {
        ...(!values.firstName
          ? {
              firstName: {
                type: 'required',
                message: 'Veuillez renseignez votre prénom',
              },
            }
          : {}),
        ...(!values.lastName
          ? {
              lastName: {
                type: 'required',
                message: 'Veuillez renseignez votre nom',
              },
            }
          : {}),
        ...(!values.city
          ? {
              city: {
                type: 'required',
                message: 'Veuillez renseignez votre ville',
              },
            }
          : {}),
        ...(!values.email
          ? {
              email: {
                type: 'required',
                message: 'Veuillez renseignez votre email',
              },
            }
          : {}),
        ...(!values.title
          ? {
              title: {
                type: 'required',
                message: 'Veuillez donner un titre, ex: Développeur fullstack',
              },
            }
          : {}),
      },
    }
  }

  const methods = useForm<AddCandidatureInput>({
    resolver,
    defaultValues: initialValues,
  })

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors, isValid },
    getValues,
  } = methods

  const { data: session } = useSession()
  const router = useRouter()

  const isOwner = session?.user?.email === initialValues?.userEmail

  const { mutate, isLoading: isSubmitLoading } = trpc.candidature.add.useMutation({
    onSuccess: (candidature) => {
      setVisible(false)
      if (initialValues) {
        isOwner
          ? toast.success('Votre candidature a bien été mise à jour')
          : toast.success('La candidature a bien été mise à jour')
        router.push(`/list/${candidature.id}`)
        return
      }
      toast.success(
        'Votre candidature a bien été sauvegardée. Vous pouvez demander la vérification à tout moment.',
      )
      router.push(`/list/${candidature.id}`)
    },
  })

  const onSubmit: SubmitHandler<AddCandidatureInput> = (data: AddCandidatureInput) => {
    const experiences = getAdaptedInput<AddCandidatureInput['experiences']>(
      data.experiences,
    )

    const experiencesAsso = getAdaptedInput<AddCandidatureInput['experiencesAsso']>(
      data.experiencesAsso,
    )

    const schools = getAdaptedInput<AddCandidatureInput['schools']>(data.schools)

    data.experiences = experiences
    data.schools = schools
    data.experiencesAsso = experiencesAsso

    if (Object.keys(errors).length > 0) {
      return
    }

    mutate(data)
  }

  useEffect(() => {
    reset(initialValues)
  }, [initialValues, reset])

  return {
    register,
    handleSubmit,
    control,
    errors,
    isValid,
    getValues,
    methods,
    onSubmit,
    isSubmitLoading,
  }
}

const getFilteredCandidatures = (
  candidatures: Candidature[],
  search: string,
  competences: string[],
  contractType?: string,
) => {
  const filteredCandidatures = candidatures.filter((candidature) => {
    const searchLower = search
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
    const title = candidature.title?.normalize('NFD').replace(/\p{Diacritic}/gu, '')
    const city = candidature.city?.normalize('NFD').replace(/\p{Diacritic}/gu, '')
    const competencesString = candidature.Competences?.map((c) => c.type).join(' ')
    const isInCompetencesType = competences.length
      ? candidature.Competences?.some((c) => competences.includes(c.type))
      : true
    const isInContractType = contractType ? candidature.kind === contractType : true

    return (
      (title?.toLowerCase().includes(searchLower) ||
        competencesString?.toLowerCase().includes(searchLower) ||
        city?.toLowerCase().includes(searchLower)) &&
      isInCompetencesType &&
      isInContractType
    )
  })

  return filteredCandidatures
}

export const useFilteredCandidatures = (candidatures: Candidature[]) => {
  const [search, setSearch] = useState('')
  const [competences, setCompetences] = useState<CompetenceType[]>([])
  const [contractType, setContractType] = useState<CandidatureKind>()

  const filteredCandidatures = getFilteredCandidatures(
    candidatures,
    search,
    competences,
    contractType,
  )

  return {
    filteredCandidatures,
    search,
    setSearch,
    competences,
    setCompetences,
    contractType,
    setContractType,
  }
}

export const useAskReview = (setVisible?: Dispatch<SetStateAction<boolean>>) => {
  const utils = trpc.useContext()

  const { mutate: askReview } = trpc.review.create.useMutation({
    onSuccess: () => {
      toast.success('Vérification de la candidature demandée!')

      utils.candidature['details'].refetch()
      utils.candidature['getByUser'].refetch()
    },
  })

  if (!setVisible) {
    return {
      askReview,
    }
  }

  const { mutate: addReview } = trpc.review.save.useMutation({
    onSuccess: (candidature) => {
      if (candidature.approved) {
        toast.success('Candidature approuvée!')
      } else {
        toast.info('Candidature rejetée!')
      }

      utils.candidature['details'].refetch()
      utils.candidature['getByUser'].refetch()

      setVisible(false)
    },
  })

  return {
    askReview,
    addReview,
  }
}
