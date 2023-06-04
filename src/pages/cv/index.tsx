import { Competences as CompetenceT, CompetenceType } from '@prisma/client'
import { CVDetails } from 'components/CVDetails'
import { useState } from 'react'
import { Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { RouterInput, trpc } from 'utils/trpc'
import { getCompetencesByType, getSelectValue } from 'utils/utils'

/* import { useSession } from 'next-auth/react'
import { trpc } from 'utils/trpc'
 */

type AddCandidatureInput = RouterInput['candidature']['add']

type Experiences = Pick<AddCandidatureInput, 'experiences'>['experiences'][number][]

type Schools = Pick<AddCandidatureInput, 'schools'>['schools'][number][]

type Competences = Pick<CompetenceT, 'description' | 'type'>

const AddCandidature: React.FC = () => {
  /* const { data: profile } = trpc.user.profile.useQuery()
  const { data: session } = useSession() */

  const [experiences, setExperiences] = useState<Experiences>([
    {
      startAt: new Date(),
      endAt: new Date(),
      companyName: '',
      missions: [''],
    },
  ])

  const [schools, setSchools] = useState<Schools>([
    {
      startAt: new Date(),
      endAt: new Date(),
      universityName: '',
      description: '',
    },
  ])

  const [competences, setCompetences] = useState<Competences[]>([
    {
      description: '',
      type: 'PROJECT_MANAGEMENT',
    },
  ])

  const [checked, setChecked] = useState<boolean>(false)

  const { mutate } = trpc.candidature.add.useMutation()

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
              firstName: {
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

  const {
    unregister,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddCandidatureInput>({ resolver })

  const watchFields = watch(['firstName', 'lastName', 'city', 'kind', 'title']) // you can also target specific fields by their names

  const experiencesWatched = watch('experiences')
  const competencesWatched = watch('competences')
  const schoolsWatched = watch('schools')

  const onSubmit: SubmitHandler<AddCandidatureInput> = (data: AddCandidatureInput) => {
    const experiences = data.experiences.map((experience) => {
      return {
        startAt: new Date(experience.startAt),
        endAt: experience.endAt && new Date(experience.endAt),
        companyName: experience.companyName,
        missions: experience.missions,
      }
    })

    const schools = data.schools.map((school) => {
      return {
        startAt: new Date(school.startAt),
        endAt: school.endAt && new Date(school.endAt),
        universityName: school.universityName,
        description: school.description,
      }
    })

    data.experiences = experiences
    data.schools = schools

    if (Object.keys(errors).length > 0) {
      return
    }

    mutate(data)
  }

  const competencesByType = getCompetencesByType(competencesWatched)

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
                  <span className="label-text-alt text-mc">{errors.title?.message}</span>
                </label>
              </div>
            </div>
            <div id="profile" className="space-y-4">
              <h1 className="sm:text-xl text-center font-semibold text-mc">Profil</h1>
              <div className="table mx-auto my-0 w-11/12 sm:w-4/6 border rounded-xl p-4">
                <div className="sm:flex sm:space-x-16 justify-center">
                  <div className="form-control w-full max-w-xs">
                    <label className="label">
                      <span className="label-text">Prénom</span>
                    </label>
                    <input
                      className="input input-bordered w-full max-w-xs"
                      placeholder="..."
                      type="text"
                      {...register('firstName')}
                      key="firstName"
                    />
                    <label className="label">
                      <span className="label-text-alt text-mc">
                        {errors.firstName?.message}
                      </span>
                    </label>
                  </div>
                  <div className="form-control w-full max-w-xs">
                    <label className="label">
                      <span className="label-text">Nom</span>
                    </label>
                    <input
                      {...register('lastName')}
                      placeholder="..."
                      className="input input-bordered w-full max-w-xs"
                      type="text"
                    />
                    <label className="label">
                      <span className="label-text-alt text-mc">
                        {errors.lastName?.message}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="sm:flex sm:space-x-16 justify-center">
                  <div className="form-control w-full max-w-xs">
                    <label className="label">
                      <span className="label-text">Ville</span>
                    </label>
                    <input
                      className="input input-bordered w-full max-w-xs"
                      placeholder="Lille, Amiens..."
                      type="text"
                      {...register('city')}
                    />
                    <label className="label">
                      <span className="label-text-alt text-mc">
                        {errors.city?.message}
                      </span>
                    </label>
                  </div>
                  <div className="form-control w-full max-w-xs">
                    <label className="label">
                      <span className="label-text">Informations complémentaires</span>
                    </label>
                    <input
                      {...register('info')}
                      placeholder="Disponible dans toute la france..."
                      className="input input-bordered w-full max-w-xs"
                      type="text"
                    />
                  </div>
                </div>
                <div className="sm:flex sm:space-x-16 justify-center">
                  <div className="form-control w-full sm:w-4/6">
                    <label className="label">
                      <span className="label-text">Type de contract recherché</span>
                    </label>

                    <select
                      className="select select-bordered w-full"
                      {...register('kind')}
                      defaultValue={'CDI'}
                    >
                      <option value="ALTERNANCE">Alternance</option>
                      <option value="CDI">CDI</option>
                      <option value="STAGE">Stage</option>
                    </select>
                  </div>
                </div>
                <div className="sm:flex sm:space-x-16 justify-center">
                  <div className="form-control w-full max-w-xs">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      className="input input-bordered w-full max-w-xs"
                      placeholder="mail@mail.com"
                      type="text"
                      {...register('email')}
                    />
                    <label className="label">
                      <span className="label-text-alt text-mc">
                        {errors.email?.message}
                      </span>
                    </label>
                  </div>
                  <div className="form-control w-full max-w-xs">
                    <label className="label">
                      <span className="label-text">Téléphone</span>
                    </label>
                    <input
                      className="input input-bordered w-full max-w-xs"
                      placeholder="06 11 12 09 86"
                      type="text"
                      {...register('mobile')}
                    />
                  </div>
                </div>
                <div className="sm:flex sm:space-x-16 justify-center">
                  <div className="form-control w-full sm:w-4/6">
                    <label className="label">
                      <span className="label-text">Télétravail</span>
                    </label>
                    <label className="cursor-pointer label">
                      <span className="label-text text-lg">
                        Je suis ouvert au télétravail
                      </span>
                      <input
                        {...register('remote')}
                        placeholder="Disponible dans toute la france..."
                        className="checkbox checkbox-primary"
                        type="checkbox"
                        defaultChecked={false}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div id="experiences" className="space-y-4">
              <h1 className="text-xl text-center font-semibold text-mc">Expériences</h1>
              {experiences.map((experience, index) => {
                return (
                  <div
                    className="table mx-auto my-0 w-11/12 sm:w-4/6 border rounded-xl p-4"
                    key={index}
                  >
                    {index !== 0 && (
                      <div className="absolute right-2">
                        <button
                          className="btn btn-sm btn-circle btn-outline btn-primary"
                          onClick={(e) => {
                            e.preventDefault()
                            setExperiences((prev) => {
                              const actual = [...prev]
                              actual.splice(index, 1)
                              return actual
                            })
                            unregister(`experiences.${index}`)
                          }}
                        >
                          X
                        </button>
                      </div>
                    )}
                    <div className="sm:flex sm:space-x-16 justify-center">
                      <div className="form-control w-full sm:w-4/6">
                        <label className="label">
                          <span className="label-text">Entreprise</span>
                        </label>
                        <input
                          className="input input-bordered w-full"
                          type="text"
                          // defaultValue={experience.experiences[0].startAt.toISOString()}
                          {...register(`experiences.${index}.companyName`)}
                        />
                      </div>
                    </div>
                    <div className="sm:flex sm:space-x-16 justify-center">
                      <div className="form-control w-full max-w-xs">
                        <label className="label">
                          <span className="label-text">Date de début</span>
                        </label>
                        <input
                          className="input input-bordered w-full max-w-xs"
                          type="date"
                          required
                          // defaultValue={experience.experiences[0].startAt.toISOString()}
                          {...register(`experiences.${index}.startAt`)}
                        />
                      </div>
                      <div className="form-control w-full max-w-xs">
                        <label className="label">
                          <span className="label-text">Date de fin</span>
                        </label>
                        <input
                          className="input input-bordered w-full max-w-xs"
                          type="date"
                          {...register(`experiences.${index}.endAt`)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-full md:w-4/6">
                        <label className="label">
                          <span className="label-text font-semibold text-lg">
                            Missions
                          </span>
                        </label>
                        <div className="space-y-4">
                          {experience.missions.map((_, indexMission) => {
                            return (
                              <div
                                key={indexMission}
                                className="flex justify-between items-center space-x-4"
                              >
                                <input
                                  className="input input-bordered w-full"
                                  type="text"
                                  {...register(
                                    `experiences.${index}.missions.${indexMission}`,
                                  )}
                                />
                                <button
                                  className="btn btn-sm btn-circle btn-outline btn-primary"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    setExperiences((prev) => {
                                      const previous = prev
                                      previous[index].missions.splice(indexMission, 1)

                                      return [...previous]
                                    })
                                    unregister(
                                      `experiences.${index}.missions.${indexMission}`,
                                    )
                                  }}
                                >
                                  X
                                </button>
                              </div>
                            )
                          })}
                          <button
                            className="btn btn-sm btn-primary text-opacity-100 flex m-auto"
                            onClick={(e) => {
                              e.preventDefault()
                              setExperiences((prev) => {
                                return [
                                  ...prev.slice(0, index),
                                  {
                                    ...prev[index],
                                    missions: [...prev[index].missions, ''],
                                  },
                                  ...prev.slice(index + 1),
                                ]
                              })
                            }}
                            type="button"
                          >
                            Ajouter une mission
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div className="flex justify-center mt-2">
                <button
                  className="btn btn-outline btn-primary"
                  onClick={() => {
                    setExperiences((prev) => {
                      return [
                        ...prev,
                        {
                          companyName: '',
                          missions: [''],
                          startAt: new Date(),
                          endAt: new Date(),
                        },
                      ]
                    })
                  }}
                  type="button"
                >
                  Ajouter une éxperience
                </button>
              </div>
            </div>
            <div id="school" className="space-y-4">
              <h1 className="text-xl text-center font-semibold text-mc">
                Parcours scolaire
              </h1>
              {schools.map((school, index) => {
                return (
                  <div
                    className="table mx-auto my-0 w-11/12 sm:w-4/6 border rounded-xl p-2"
                    key={index}
                  >
                    {index !== 0 && (
                      <div className="absolute right-2">
                        <button
                          className="btn btn-sm btn-circle btn-primary btn-outline"
                          onClick={(e) => {
                            e.preventDefault()
                            setSchools((prev) => {
                              const actual = [...prev]
                              actual.splice(index, 1)
                              return actual
                            })
                            unregister(`schools.${index}`)
                          }}
                        >
                          X
                        </button>
                      </div>
                    )}
                    <div className="sm:flex sm:space-x-16 justify-center">
                      <div className="form-control w-full sm:w-4/6">
                        <label className="label">
                          <span className="label-text">Lieu d&apos;étude</span>
                        </label>
                        <input
                          className="input input-bordered w-full"
                          type="text"
                          {...register(`schools.${index}.universityName`)}
                        />
                      </div>
                    </div>
                    <div className="sm:flex sm:space-x-16 justify-center">
                      <div className="form-control w-full max-w-xs">
                        <label className="label">
                          <span className="label-text">Date de début</span>
                        </label>
                        <input
                          className="input input-bordered w-full max-w-xs"
                          type="date"
                          required
                          {...register(`schools.${index}.startAt`)}
                        />
                      </div>
                      <div className="form-control w-full max-w-xs">
                        <label className="label">
                          <span className="label-text">Date de fin</span>
                        </label>
                        <input
                          className="input input-bordered w-full max-w-xs"
                          type="date"
                          {...register(`schools.${index}.endAt`)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-full md:w-4/6">
                        <label className="label">
                          <span className="label-text">Description</span>
                        </label>
                        <textarea
                          className="textarea h-24 textarea-bordered w-full"
                          placeholder="Description"
                          {...register(`schools.${index}.description`)}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
              <div className="flex justify-center mt-2">
                <button
                  className="btn btn-outline btn-primary"
                  onClick={() => {
                    setSchools((prev) => {
                      return [
                        ...prev,
                        {
                          description: '',
                          startAt: new Date(),
                          endAt: new Date(),
                          universityName: '',
                        },
                      ]
                    })
                  }}
                  type="button"
                >
                  Ajouter un parcours scolaire
                </button>
              </div>
            </div>
            <div id="skills" className="space-y-4">
              <h1 className="text-xl text-center font-semibold text-mc">Compétences</h1>
              {competences.map((competence, index) => {
                return (
                  <div
                    className="table mx-auto my-0 w-11/12 sm:w-4/6 border rounded-xl p-2"
                    key={index}
                  >
                    {index !== 0 && (
                      <div className="absolute right-2">
                        <button
                          className="btn btn-sm btn-circle btn-outline btn-primary"
                          onClick={(e) => {
                            e.preventDefault()
                            setCompetences((prev) => {
                              const actual = [...prev]
                              actual.splice(index, 1)
                              return actual
                            })
                            unregister(`competences.${index}`)
                          }}
                        >
                          X
                        </button>
                      </div>
                    )}
                    <div className="sm:flex sm:space-x-16 justify-center">
                      <div className="form-control w-full sm:w-4/6">
                        <label className="label">
                          <span className="label-text">Type</span>
                        </label>

                        <select
                          className="select select-bordered w-full"
                          {...register(`competences.${index}.type`)}
                          defaultValue={CompetenceType.FRONTEND}
                        >
                          {Object.keys(CompetenceType).map((key) => (
                            <option key={key} value={key}>
                              {getSelectValue(key as CompetenceType)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="w-full md:w-4/6">
                        <label className="label">
                          <span className="label-text">Description</span>
                        </label>
                        <textarea
                          className="textarea h-24 textarea-bordered w-full"
                          placeholder="Description"
                          {...register(`competences.${index}.description`)}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
              <div className="flex justify-center mt-2">
                <button
                  className="btn btn-outline btn-primary"
                  onClick={() => {
                    setCompetences((prev) => {
                      return [
                        ...prev,
                        {
                          description: '',
                          type: CompetenceType.PROJECT_MANAGEMENT,
                        },
                      ]
                    })
                  }}
                  type="button"
                >
                  Ajouter une compétence
                </button>
              </div>
            </div>
            <div className="fixed right-0 bottom-2 m-2 justify-end">
              <div className="space-x-2">
                <button
                  type="button"
                  className="btn btn-info"
                  disabled={false}
                  onClick={() => setChecked((prev) => !prev)}
                >
                  Prévualiser
                </button>
                <button type="submit" className="btn btn-primary" disabled={false}>
                  Déposer le CV
                </button>
              </div>
            </div>
          </form>
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

        <div className="fixed top-0 left-0 z-20 w-9/12 h-full transition-all duration-500 transform -translate-x-full bg-white shadow-lg peer-checked:translate-x-0">
          <div className="px-6 py-4">
            <h2 className="text-lg font-semibold">Prévisualition</h2>
            <CVDetails
              candidature={{
                id: '',
                firstName: watchFields[0],
                lastName: watchFields[1],
                city: watchFields[2],
                title: watchFields[4],
                experiences: experiencesWatched?.map((experience) => ({
                  ...experience,
                  startAt: experience.startAt ? new Date(experience.startAt) : new Date(),
                  endAt: experience.endAt ? new Date(experience.endAt) : new Date(),
                  id: '',
                  candidatureId: '',
                })),
                schools: schoolsWatched?.map((school) => ({
                  ...school,
                  startAt: school.startAt ? new Date(school.startAt) : new Date(),
                  endAt: school.endAt ? new Date(school.endAt) : new Date(),
                  id: '',
                  candidatureId: '',
                })),
                competenceByType: competencesByType,
                Competences: competencesWatched?.map((competence) => ({
                  ...competence,
                  id: '',
                  candidatureId: '',
                })),
                email: 'mail@preview.com',
              }}
              size="full"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default AddCandidature
