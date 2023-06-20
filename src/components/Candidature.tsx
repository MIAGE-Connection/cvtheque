import { CVDetails } from 'components/CVDetails'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { FormProvider, Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { RouterInput, trpc } from 'utils/trpc'
import { getCompetencesByType } from 'utils/utils'
import { EntrepriseFields } from './candidature/EnterpriseFields'
import { ProfileFields } from './candidature/ProfileFields'
import { SchoolFields } from './candidature/SchoolFields'
import { SkillFields } from './candidature/SkillFields'
import { AssociationFields } from './candidature/AssociationFields'
import { toast } from 'react-toastify'

export type AddCandidatureInput = RouterInput['candidature']['add']

type Props = {
  initialValues?: AddCandidatureInput
}

const Candidature: React.FC<Props> = ({ initialValues }) => {
  const { data: session } = useSession()

  const [checked, setChecked] = useState<boolean>(false)

  const isOwner = session?.user?.email === initialValues?.userEmail

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

  const methods = useForm<AddCandidatureInput>({ resolver, defaultValues: initialValues })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = methods

  const { mutate } = trpc.candidature.add.useMutation({
    onSuccess: () => {
      if (initialValues) {
        isOwner
          ? toast.success('Votre candidature a bien été mise à jour')
          : toast.success('La candidature a bien été mise à jour')
        return
      }
      toast.success('Votre candidature a bien été envoyée et est soumise à validation')
    },
  })

  const [candidature, setCandidature] = useState<AddCandidatureInput | undefined>()

  const onSubmit: SubmitHandler<AddCandidatureInput> = (data: AddCandidatureInput) => {
    const experiences = data.experiences.map((experience) => {
      return {
        ...experience,
        startAt: new Date(experience.startAt),
        ...(experience.endAt && {
          endAt: new Date(experience.endAt),
        }),
      }
    })

    const experiencesAsso = data.experiencesAsso.map((experience) => {
      return {
        ...experience,
        startAt: new Date(experience.startAt),
        ...(experience.endAt && {
          endAt: new Date(experience.endAt),
        }),
      }
    })

    const schools = data.schools.map((school) => {
      return {
        ...school,
        startAt: new Date(school.startAt),
        ...(school.endAt && {
          endAt: new Date(school.endAt),
        }),
      }
    })

    data.experiences = experiences
    data.schools = schools
    data.experiencesAsso = experiencesAsso

    if (Object.keys(errors).length > 0) {
      return
    }

    mutate({
      ...data,
      userEmail: session?.user?.email || '',
    })
  }

  return (
    <>
      <div className="sm:m-4 space-y-2">
        <div>
          <h1 className="text-xl font-semibold text-mc">
            Bienvenue sur le site de dépôt de CV de l&apos;association Miage Connection.
            Nous vous invitons à compléter le formulaire ci-dessous afin que le bureau
            puisse éventuellement vous faire un retour avant publication.
          </h1>
        </div>
        <div className="sm:p-2">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div id="title" className="justify-center flex">
                <div className="form-control w-4/6 ">
                  <label className="label">
                    <span className="label-text text-xl font-bold text-mc">Titre</span>
                  </label>
                  <input
                    className="input input-bordered w-full "
                    placeholder="..."
                    type="text"
                    {...register('title')}
                    key="firstName"
                  />
                  <label className="label">
                    <span className="label-text-alt text-mc">
                      {errors.title?.message}
                    </span>
                  </label>
                </div>
              </div>
              <ProfileFields {...{ register }} />
              <EntrepriseFields {...{ control, register }} />
              <SchoolFields {...{ control, register }} />
              <SkillFields {...{ control, register }} />
              <AssociationFields {...{ control, register }} />
              <div id="freetime" className="justify-center flex">
                <div className="form-control w-4/6 ">
                  <label className="label">
                    <span className="label-text text-xl font-bold text-mc">
                      Loisirs & activités
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full "
                    placeholder="..."
                    {...register('passions')}
                    key="passions"
                  />
                </div>
              </div>
              <div className="fixed right-0 bottom-2 m-2 justify-end">
                <div className="space-x-2">
                  <button
                    type="button"
                    className="btn btn-info hidden md:inline-flex"
                    disabled={false}
                    onClick={() => {
                      setCandidature(getValues())
                      setChecked((prev) => !prev)
                    }}
                  >
                    Prévualiser
                  </button>
                  {initialValues ? (
                    <button type="submit" className="btn btn-primary" disabled={false}>
                      Sauvegarder
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-primary" disabled={false}>
                      Déposer le CV
                    </button>
                  )}
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
      <div className="flex ">
        <input
          type="checkbox"
          id="drawer-toggle"
          className="relative sr-only peer"
          checked={checked}
          onChange={() => setChecked((prev) => !prev)}
        />

        <div className="fixed hidden md:block top-0 left-0 z-20 w-9/12 h-full transition-all duration-500 transform -translate-x-full bg-white shadow-lg peer-checked:translate-x-0">
          <div className="px-6 py-4">
            <h2 className="text-lg font-semibold">Prévisualition</h2>
            {candidature && (
              <CVDetails
                candidature={{
                  city: candidature.city,
                  firstName: candidature.firstName,
                  lastName: candidature.lastName,
                  kind: candidature.kind,
                  title: candidature.title,
                  passions: candidature.passions,
                  experiences: candidature.experiences?.map((experience) => ({
                    ...experience,
                    missions: experience.missions.map((m) => m.mission),
                    startAt: experience.startAt
                      ? new Date(experience.startAt)
                      : new Date(),
                    endAt: experience.endAt ? new Date(experience.endAt) : new Date(),
                    id: '',
                    candidatureId: '',
                  })),
                  ExperienceAsso: candidature.experiencesAsso?.map((experience) => ({
                    ...experience,
                    missions: experience.missions.map((m) => m.mission),
                    startAt: experience.startAt
                      ? new Date(experience.startAt)
                      : new Date(),
                    endAt: experience.endAt ? new Date(experience.endAt) : new Date(),
                    id: '',
                    candidatureId: '',
                  })),
                  schools: candidature.schools?.map((school) => ({
                    ...school,
                    startAt: school.startAt ? new Date(school.startAt) : new Date(),
                    endAt: school.endAt ? new Date(school.endAt) : new Date(),
                    universityName: school.universityName,
                    id: '',
                    candidatureId: '',
                  })),
                  competenceByType: getCompetencesByType(candidature.competences),
                  Competences: candidature.competences?.map((competence) => ({
                    ...competence,
                    id: '',
                    candidatureId: '',
                  })),
                  email: 'mail@preview.com',
                }}
                size="full"
                showButton={false}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Candidature
