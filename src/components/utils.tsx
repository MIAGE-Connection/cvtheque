import { CompetenceType } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { RouterInput, RouterOutput, trpc } from 'utils/trpc'

export type Props = {
  initialValues?: AddCandidatureInput
}

export type AddCandidatureInput = RouterInput['candidature']['add'] & {
  userEmail: string
}

/**
 * @description get the same array with startAt and endAt as Date
 * @param argument array of experiences, schools or experiencesAsso
 * @returns the same array with startAt and endAt as Date
 */
export const getAdaptedInput = <T,>(
  argument:
    | AddCandidatureInput['experiences']
    | AddCandidatureInput['schools']
    | AddCandidatureInput['experiencesAsso'],
): T => {
  const values = argument?.map((arg) => {
    return {
      ...arg,
      startAt: new Date(arg.startAt),
      ...(arg.endAt && arg.endAt.toString() !== ''
        ? { endAt: new Date(arg.endAt) }
        : { endAt: null }),
    }
  })

  return values as unknown as T
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

  const { mutate } = trpc.candidature.add.useMutation({
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
  }
}

export type Candidature = Partial<RouterOutput['candidature']['list'][number]>

export const getFilteredCandidatures = (
  candidatures: Candidature[],
  search: string,
  competences: string[],
) => {
  const filteredCandidatures = candidatures.filter((candidature) => {
    const searchLower = search.toLowerCase()
    const fullName = `${candidature.firstName} ${candidature.lastName}`
    const title = candidature.title
    const city = candidature.city
    const competencesString = candidature.Competences?.map((c) => c.type).join(' ')
    const isInCompetencesType = competences.length
      ? candidature.Competences?.some((c) => competences.includes(c.type))
      : true

    return (
      (fullName.toLowerCase().includes(searchLower) ||
        title?.toLowerCase().includes(searchLower) ||
        competencesString?.toLowerCase().includes(searchLower) ||
        city?.toLowerCase().includes(searchLower)) &&
      isInCompetencesType
    )
  })

  return filteredCandidatures
}

export const useFilteredCandidatures = (candidatures: Candidature[]) => {
  const [search, setSearch] = useState('')
  const [competences, setCompetences] = useState<CompetenceType[]>([])

  const filteredCandidatures = getFilteredCandidatures(candidatures, search, competences)

  return {
    filteredCandidatures,
    search,
    setSearch,
    competences,
    setCompetences,
  }
}
