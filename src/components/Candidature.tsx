import { CVDetails } from 'components/CVDetails'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FormProvider, Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { RouterInput, trpc } from 'utils/trpc'
import { getCompetencesByType } from 'utils/utils'
import Modal from './Modal'
import { AssociationFields } from './candidature/AssociationFields'
import { EntrepriseFields } from './candidature/EnterpriseFields'
import { ProfileFields } from './candidature/ProfileFields'
import { SchoolFields } from './candidature/SchoolFields'
import { SkillFields } from './candidature/SkillFields'

export type AddCandidatureInput = RouterInput['candidature']['add'] & {
  userEmail: string
}

type Props = {
  initialValues?: AddCandidatureInput
}

enum TabType {
  profile = 'profile',
  experiences = 'experiences',
  schools = 'schools',
  skills = 'skills',
  associations = 'associations',
  other = 'other',
}

const Candidature: React.FC<Props> = ({ initialValues }) => {
  const { data: session } = useSession()
  const router = useRouter()

  const [checked, setChecked] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)

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

  useEffect(() => {
    reset(initialValues)
  }, [initialValues, reset])

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
      toast.success('Votre candidature a bien été envoyée et est soumise à validation')
    },
  })

  const [candidature, setCandidature] = useState<AddCandidatureInput | undefined>()

  const onSubmit: SubmitHandler<AddCandidatureInput> = (data: AddCandidatureInput) => {
    const experiences = data.experiences?.map((experience) => {
      return {
        ...experience,
        startAt: new Date(experience.startAt),
        ...(experience.endAt && {
          endAt: new Date(experience.endAt),
        }),
      }
    })

    const experiencesAsso = data.experiencesAsso?.map((experience) => {
      return {
        ...experience,
        startAt: new Date(experience.startAt),
        ...(experience.endAt && {
          endAt: new Date(experience.endAt),
        }),
      }
    })

    const schools = data.schools?.map((school) => {
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

    mutate(data)
  }

  const [activeTab, setActiveTab] = useState<TabType>(TabType.profile)

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
        <div className="flex space-x-8 justify-center items-baseline">
          {Object.values(TabType).map((type) => (
            <div key={type} onClick={() => setActiveTab(type)}>
              <button
                className={`${
                  activeTab === type
                    ? 'font-bold text-mc  border-b-2 border-mc text-3xl'
                    : 'border-b-[1px] border-b-gray-700 text-2xl'
                } ${!isValid ? 'cursor-not-allowed' : ''}`}
                disabled={!isValid}
              >
                {
                  {
                    profile: 'Profil',
                    experiences: 'Expériences',
                    schools: 'Parcours scolaire',
                    skills: 'Compétences',
                    associations: 'Parcours associatif',
                    other: 'Loisirs',
                  }[type]
                }
              </button>
            </div>
          ))}
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
              {
                {
                  profile: <ProfileFields {...{ register }} />,
                  experiences: <EntrepriseFields {...{ control, register }} />,
                  schools: <SchoolFields {...{ control, register }} />,
                  skills: <SkillFields {...{ control, register }} />,
                  associations: <AssociationFields {...{ control, register }} />,
                  other: (
                    <div id="freetime" className="justify-center flex">
                      <div className="form-control w-11/12 lg:w-4/6 ">
                        <label className="label">
                          <span className="label-text text-xl font-bold text-mc">
                            Loisirs & activités
                          </span>
                        </label>
                        <textarea
                          className="textarea textarea-bordered w-full"
                          placeholder="..."
                          {...register('passions')}
                          key="passions"
                        />
                      </div>
                    </div>
                  ),
                }[activeTab]
              }

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
                    <button
                      onClick={() => setVisible(true)}
                      className="btn btn-primary"
                      type="button"
                      disabled={!isValid}
                    >
                      Sauvegarder
                    </button>
                  ) : (
                    <button
                      onClick={() => setVisible(true)}
                      type="button"
                      className="btn btn-primary"
                      disabled={!isValid}
                    >
                      Déposer le CV
                    </button>
                  )}
                </div>
              </div>
              <Modal open={visible} style={{ maxWidth: '50%' }}>
                <h3 className="font-bold text-2xl text-mc">Information</h3>
                <div className="space-y-2 text-lg">
                  <p className="text-wrap">
                    Nous accordons une grande importance à la qualité et à la pertinence
                    des CV soumis sur notre plateforme. Afin de garantir cela, tous les CV
                    seront soumis à une <strong className="font-bold">validation</strong>{' '}
                    rigoureuse par le bureau national de l&apos;association{' '}
                    <strong className="text-mc">Miage Connection</strong>.
                  </p>
                  <p>
                    Cette procédure de validation vise à assurer que seuls les CV qui
                    répondent aux critères spécifiques de l&apos;association seront mis à
                    disposition des employeurs. L&apos;équipe du bureau national examinera
                    attentivement chaque CV pour évaluer sa conformité avec les exigences
                    de l&apos;association.
                  </p>
                  <h3 className="font-bold text-2xl text-mc">Données personnelles</h3>
                  <p>
                    Nous comprenons l&apos;importance de protéger vos informations
                    personnelles et nous vous assurons que ce processus de validation est
                    strictement confidentiel.
                  </p>
                </div>
                <div className="modal-action">
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() => {
                      setVisible(false)
                    }}
                  >
                    Annuler
                  </button>
                  <button className="btn btn-primary" type="submit">
                    {initialValues
                      ? 'Sauvegarder et demander une relecture'
                      : 'Déposer la candidature'}
                  </button>
                </div>
              </Modal>
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
                  mobile: candidature.mobile,
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
                  competenceByType: getCompetencesByType(candidature.competences || []),
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
