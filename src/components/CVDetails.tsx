import { RouterOutput } from 'utils/trpc'

type Candidature = Partial<RouterOutput['candidature']['details']>

export const CVDetails = (props: {
  candidature: Candidature
  size: 'full' | 'center'
}) => {
  const { candidature, size } = props
  return (
    <div className="flex justify-center">
      <div
        className={`p-8 border rounded-xl mx-8 mt-4 ${
          size === 'full' ? 'w-full' : 'w-4/6'
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <div className="flex space-x-2 font-bold text-2xl text-mc">
              <div>{candidature?.firstName}</div>
              <div>{candidature?.lastName}</div>
            </div>
            <div className="text-xl">{candidature?.email}</div>
          </div>
          <div className="text-6xl font-bold text-mc">{candidature?.title}</div>
        </div>
        <div className="space-y-12 mt-12">
          <div>
            <p className="text-2xl font-semibold text-mc">Ville</p>
            <p className="text-lg">{candidature?.city}</p>
          </div>
          <div>
            <p className="text-2xl text-mc">Éxperiences</p>
            <div>
              {candidature?.experiences?.map((experience, i) => {
                return (
                  <div key={i} className="mt-4">
                    <div className="flex justify-between">
                      <div className="font-semibold text-lg">
                        {experience.companyName}
                      </div>
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
                        {experience.missions?.map((mission, i) => {
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
            <p className="text-2xl text-mc">Parcours scolaire</p>
            <div>
              {candidature?.schools?.map((school, i) => {
                return (
                  <div key={i} className="mt-4">
                    <div className="flex justify-between">
                      <div className="font-semibold text-lg">{school.universityName}</div>
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
            <p className="text-2xl text-mc">Compétences</p>
            <div>
              {candidature?.competenceByType?.map((competence) => {
                return (
                  <div key={competence.type} className="mt-4">
                    <div className="">
                      <div className="font-semibold text-xl">{competence.type}</div>
                      <ul className="list-disc ml-4">
                        {competence.descriptions.map((description, i) => {
                          return <li key={`${description}-${i}`}>{description}</li>
                        })}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
