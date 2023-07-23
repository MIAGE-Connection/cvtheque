import { zodResolver } from '@hookform/resolvers/zod'
import { CandidatureKind, CompetenceType, LangLevel } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { RouterInput, RouterOutput, trpc } from 'utils/trpc'
import { dateToInputDate } from 'utils/utils'
import { z } from 'zod'

const schema = z.object({
  id: z.string().nullish(),
  firstName: z.string().min(1, { message: 'Le prénom est obligatoire' }),
  lastName: z.string(),
  city: z.string().min(1, { message: 'La ville est obligatoire' }),
  info: z.string().nullish(),
  title: z.string().min(1, { message: 'Le titre est obligatoire' }),
  email: z.string().email({ message: "L'email est invalide" }),
  remote: z.boolean(),
  mobile: z.string().nullish(),
  passions: z.string().nullish(),
  languages: z.array(
    z.object({
      language: z.string().min(1, { message: 'La langue est obligatoire' }),
      level: z.nativeEnum(LangLevel),
    }),
  ),
  kind: z.enum([CandidatureKind.ALTERNANCE, CandidatureKind.CDI, CandidatureKind.STAGE]),
  experiences: z
    .array(
      z.object({
        startAt: z.string(),
        endAt: z.string().nullish(),
        companyName: z.string(),
        job: z.string(),
        missions: z.array(
          z.object({
            mission: z
              .string()
              .max(100, { message: 'La mission doit faire moins de 100 caractères' }),
          }),
        ),
      }),
    )
    .optional(),
  experiencesAsso: z
    .array(
      z.object({
        startAt: z.string(),
        endAt: z.string().nullish(),
        name: z.string(),
        job: z.string(),
        missions: z.array(
          z.object({
            mission: z
              .string()
              .max(100, { message: 'La mission doit faire moins de 100 caractères' }),
          }),
        ),
      }),
    )
    .optional(),
  schools: z
    .array(
      z.object({
        startAt: z.string(),
        endAt: z.string().nullish(),
        universityName: z.string(),
        description: z.string(),
        title: z.string(),
      }),
    )
    .optional(),
  competences: z
    .array(
      z.object({
        description: z.string(),
        type: z.nativeEnum(CompetenceType),
      }),
    )
    .optional(),
})

export enum TabType {
  profile = 'profile',
  experiences = 'experiences',
  schools = 'schools',
  skills = 'skills',
  associations = 'associations',
  other = 'other',
}

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

  const competences = candidature?.Competences?.map((competence) => competence)

  return {
    ...candidature,
    userEmail: '',
    email: candidature.email ?? 'mail@preview.com',
    experiences: experiences,
    experiencesAsso: experiencesAsso,
    schools: schools,
    competences,
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
  const methods = useForm<AddCandidatureInput>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  })

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
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

  const checkValidity = async (tab: TabType) => {
    switch (tab) {
      case TabType.profile:
        await trigger(['firstName', 'lastName', 'email', 'city'])
        return Object.keys(errors).length === 0
      case TabType.experiences:
        await trigger('experiences')
        return Object.keys(errors).length === 0
      case TabType.schools:
        await trigger('schools')
        return Object.keys(errors).length === 0
      default:
        return true
    }
  }

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
    data.languages = data.languages?.map((langage) => langage) || []

    if (Object.keys(errors).length > 0) {
      return
    }

    mutate(data)
  }

  return {
    checkValidity,
    register,
    handleSubmit,
    control,
    errors,
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
