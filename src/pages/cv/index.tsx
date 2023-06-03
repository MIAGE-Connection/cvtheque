import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { RouterInput, trpc } from 'utils/trpc'

/* import { useSession } from 'next-auth/react'
import { trpc } from 'utils/trpc'
 */

type AddCandidatureInput = RouterInput['candidature']['add']

type Experiences = Pick<AddCandidatureInput, 'experiences'>['experiences'][number][]

type Schools = Pick<AddCandidatureInput, 'schools'>['schools'][number][]

const AddCandidature: React.FC = () => {
  /* const { data: profile } = trpc.user.profile.useQuery()
  const { data: session } = useSession() */

  const [experiences, setExperiences] = useState<Experiences>([
    {
      startAt: new Date(),
      endAt: new Date(),
      companyName: 'Entreprise 1',
      missions: ['Ma première mission'],
    },
  ])

  const [schools, setSchools] = useState<Schools>([
    {
      startAt: new Date(),
      endAt: new Date(),
      universityName: 'Université 1',
      description: 'Ma première université',
    },
  ])

  const { mutate } = trpc.candidature.add.useMutation()

  const {
    unregister,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddCandidatureInput>()

  const onSubmit: SubmitHandler<AddCandidatureInput> = (data: AddCandidatureInput) => {
    console.log('#### ~ data:', data)

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

    mutate(data)
  }

  return (
    <div className="sm:m-4 space-y-2">
      <div>
        <h1 className="text-xl font-semibold">
          Bienvenue sur le site de dépôt de CV de l&apos;association Miage Connection.
          Nous vous invitons à compléter le formulaire ci-dessous afin que le bureau
          puisse éventuellement vous faire un retour avant publication.
        </h1>
      </div>
      <div className="sm:p-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div id="profile">
            <h1 className="sm:text-xl text-center font-semibold">Profil</h1>
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
            </div>
          </div>
          <div id="experiences" className="space-y-4">
            <h1 className="text-xl text-center font-semibold">Expériences</h1>
            {experiences.map((experience, index) => {
              return (
                <div
                  className="table mx-auto my-0 w-11/12 sm:w-4/6 border rounded-xl p-4"
                  key={index}
                >
                  {index !== 0 && (
                    <div className="absolute right-2">
                      <button
                        className="btn btn-sm btn-circle btn-outline"
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
                        <span className="label-text font-semibold text-lg">Missions</span>
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
                                className="btn btn-sm btn-circle btn-outline"
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
                          className="btn btn-sm flex m-auto"
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
                className="btn btn-outline"
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
            <h1 className="text-xl text-center font-semibold">Parcours scolaire</h1>
            {schools.map((school, index) => {
              return (
                <div
                  className="table mx-auto my-0 w-11/12 sm:w-4/6 border rounded-xl p-2"
                  key={index}
                >
                  {index !== 0 && (
                    <div className="absolute right-2">
                      <button
                        className="btn btn-sm btn-circle btn-outline"
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
                        <span className="label-text">Lieu d'étude</span>
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
                className="btn btn-outline"
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
          <div className="fixed right-0 bottom-2 m-2 justify-end">
            <button type="submit" className="btn btn-primary" disabled={false}>
              Déposer le CV
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCandidature
