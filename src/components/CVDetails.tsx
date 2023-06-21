import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { RouterOutput, trpc } from 'utils/trpc'
import { getSelectValue, isUserReviewer } from 'utils/utils'
import Modal from './Modal'

type Candidature = Partial<RouterOutput['candidature']['details']>

export const CVDetails = (props: {
  candidature: Candidature
  size: 'full' | 'center'
  showButton?: boolean
}) => {
  const { candidature, size, showButton } = props
  const { isOwner } = candidature
  const { data: session } = useSession()
  const { mutate: addReview } = trpc.review.save.useMutation({
    onSuccess: (candidature) => {
      if (candidature.approved) {
        toast.success('Candidature approuvée!')
      } else {
        toast.info('Candidature rejetée!')
      }
      setVisible(false)
    },
  })

  const [visible, setVisible] = useState(false)
  const [review, setReview] = useState('')

  const role = session?.user.role
  const isReviewer = isUserReviewer(role)
  const showEditButtons = isOwner || isReviewer
  return (
    <div className=" mt-4">
      <div className="flex justify-center">
        <div
          className={`p-4 md:p-8 border rounded-xl ${
            size === 'full' ? 'w-full' : 'w-full md:w-4/6 lg:w-full'
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
              {candidature.remote ? (
                <p className="text-lg text-gray-500">Ouvert au télétravail</p>
              ) : (
                <></>
              )}
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
                      {experience.missions.length ? (
                        <div className="mt-2">
                          <ul className="list-disc ml-4">
                            {experience.missions?.map((mission, j) => {
                              return mission === '' ? (
                                <></>
                              ) : (
                                <li key={`${mission}-${j}`}>{mission}</li>
                              )
                            })}
                          </ul>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            {candidature.ExperienceAsso?.length ? (
              <div>
                <p className="text-2xl text-mc">Associations</p>
                <div>
                  {candidature.ExperienceAsso.map((association, i) => {
                    return (
                      <div key={i} className="mt-4">
                        <div className="flex justify-between">
                          <div className="font-semibold text-lg">{association.name}</div>
                          <div className="flex space-x-4 items-center">
                            <div className="text-sm">
                              {association.startAt?.toLocaleDateString()}
                            </div>
                            {association.endAt && (
                              <>
                                <p>-</p>
                                <div className="text-sm">
                                  {association.endAt.toLocaleDateString()}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        {association.missions.length ? (
                          <div className="mt-2">
                            <ul className="list-disc ml-4">
                              {association.missions?.map((mission, j) => {
                                return mission === '' ? (
                                  <></>
                                ) : (
                                  <li key={`asso-${mission}-${j}`}>{mission}</li>
                                )
                              })}
                            </ul>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <></>
            )}
            <div>
              <p className="text-2xl text-mc">Parcours scolaire</p>
              <div>
                {candidature?.schools?.map((school, i) => {
                  return (
                    <div key={i} className="mt-4">
                      <div className="flex justify-between">
                        <div className="font-semibold text-lg">
                          {school.universityName}
                        </div>
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
              <div className="grid grid-cols-2">
                {candidature?.competenceByType?.map((competence, i) => {
                  return (
                    <div key={i} className="mt-4">
                      <div>
                        <div className="font-semibold text-xl">
                          {getSelectValue(competence.type)}
                        </div>
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
            {candidature.passions?.length ? (
              <div>
                <p className="text-2xl text-mc">Loisirs & Activités</p>
                <div>{candidature.passions}</div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      {showEditButtons && showButton && (
        <div className="flex justify-end mb-4">
          <div className="flex space-x-4">
            {isReviewer && (
              <>
                <button className="btn btn-error mt-4" onClick={() => setVisible(true)}>
                  Refuser
                </button>
                <button
                  className={`btn btn-success mt-4`}
                  onClick={() => addReview({ id: candidature.id || '', approved: true })}
                >
                  Valider
                </button>
              </>
            )}

            <Link href={`/cv/${candidature.id}`}>
              <button className="btn btn-primary mt-4">Éditer</button>
            </Link>
          </div>
        </div>
      )}
      {showEditButtons && candidature.ReviewRequest?.description && (
        <div className="border rounded-xl p-8">
          <p className="text-mc font-bold text-xl ">
            Votre CV nécessite des modifications:
          </p>
          <p className="whitespace-pre-wrap">{candidature.ReviewRequest.description}</p>
        </div>
      )}
      <Modal open={visible}>
        <h3 className="font-bold text-lg">Raison du refus</h3>
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Explication du refus"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <div className="modal-action">
          <button
            className="btn btn-primary"
            onClick={() => {
              setVisible(false)
            }}
          >
            Annuler
          </button>
          <button
            className={`btn btn-error`}
            onClick={() =>
              addReview({
                id: candidature.id || '',
                approved: false,
                description: review,
              })
            }
          >
            Refuser
          </button>
        </div>
      </Modal>
    </div>
  )
}
