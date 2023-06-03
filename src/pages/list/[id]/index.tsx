import Spin from 'components/Spin'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from 'pages/_app'
import { trpc } from 'utils/trpc'

const CV: NextPageWithLayout = () => {
  const id = useRouter().query.id as string
  const { data: candidature, isLoading } = trpc.candidature.details.useQuery({ id })
  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <div className="flex justify-center">
          <div className="p-8 border rounded-xl mx-8 mt-4 w-4/6">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex space-x-2 font-bold text-xl">
                  <div>{candidature?.firstName}</div>
                  <div>{candidature?.lastName}</div>
                </div>
                <div>{candidature?.city}</div>
                <div>{candidature?.email}</div>
              </div>
              <div className="text-4xl font-bold">{candidature?.title}</div>
            </div>
            <div className="space-y-12 mt-12">
              <div>
                <p className="text-lg font-semibold">Ville</p>
                <p>{candidature?.city}</p>
              </div>
              <div>
                <p className="text-xl">Éxperiences</p>
                <div>
                  {candidature?.experiences?.map((experience) => {
                    return (
                      <div key={experience.id} className="mt-4">
                        <div className="flex justify-between">
                          <div className="font-semibold">{experience.companyName}</div>
                          <div className="flex space-x-4 items-center">
                            <div className="text-sm">
                              {experience.startAt?.toLocaleDateString()}
                            </div>
                            {experience.endAt && (
                              <>
                                <p>-</p>
                                <div className="text-sm">
                                  {experience.endAt.toLocaleDateString()}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="mt-2">
                          <ul className="list-disc ml-4">
                            {experience.missions.map((mission, i) => {
                              return <li key={`${mission}-${i}`}>{mission}</li>
                            })}
                          </ul>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div>
                <p className="text-xl">Parcours scolaire</p>
                <div>
                  {candidature?.schools?.map((school) => {
                    return (
                      <div key={school.id} className="mt-4">
                        <div className="flex justify-between">
                          <div className="font-semibold">{school.universityName}</div>
                          <div className="flex space-x-4 items-center">
                            <div className="text-sm">
                              {school.startAt?.toLocaleDateString()}
                            </div>
                            {school.endAt && (
                              <>
                                <p>-</p>
                                <div className="text-sm">
                                  {school.endAt.toLocaleDateString()}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="mt-2">{school.description}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div>
                <p className="text-xl">Compétences</p>
                <div>
                  {candidature?.Competences?.map((competence) => {
                    return (
                      <div key={competence.id} className="mt-4">
                        <div className="">
                          <div className="font-semibold">{competence.type}</div>
                          <div className="flex space-x-4 items-center">
                            <div>{competence.description}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CV
