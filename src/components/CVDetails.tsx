import { ReviewRequest } from '@prisma/client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import {
  CandidatureCompetencesByType,
  getLangLevelValueByEnum,
  isUserReviewer,
} from 'utils'
import Modal from './Modal'
import { AddCandidatureInput, useAskReview } from './utils'
import { v4 as uuidv4 } from 'uuid'
import { getSelectValue } from 'utils'
import { GithubLogo } from './svg/GithubLogo'
import { LinkedinLogo } from './svg/LinkedinLogo'

export const CVDetails = (props: {
  candidature?:
    | AddCandidatureInput & {
        isOwner?: boolean
        ReviewRequest?: ReviewRequest | null
        competenceByType?: CandidatureCompetencesByType[]
      }
  size: 'full' | 'center'
  showButton?: boolean
}) => {
  const { data: session } = useSession()
  const { candidature, size, showButton } = props
  const [visible, setVisible] = useState(false)
  const [review, setReview] = useState('')

  const { askReview, addReview } = useAskReview(setVisible)

  const isOwner = candidature?.isOwner
  const role = session?.user.role
  const isReviewer = isUserReviewer(role)
  const showEditButtons = isOwner || isReviewer

  return (
    <div className="mt-4">
      {showEditButtons && candidature?.ReviewRequest?.description && (
        <div className="flex justify-center mb-8">
          <div className="border border-error shadow-md rounded-xl p-8 w-full xl:w-4/6">
            <p className="text-mc font-bold text-xl ">
              Votre CV nécessite des modifications:
            </p>
            <p className="whitespace-pre-wrap">{candidature.ReviewRequest.description}</p>
          </div>
        </div>
      )}
      <div className="flex justify-center overflow-x-scroll">
        <div
          className={`p-4 md:p-8 border rounded-xl ${
            size === 'full' ? 'w-full' : 'w-full xl:w-4/6'
          }`}
        >
          <div className="text-2xl font-bold text-mc md:hidden">{candidature?.title}</div>
          <div className="flex justify-between items-center">
            <div>
              <div className="flex space-x-2 font-bold text-lg lg:text-2xl text-mc">
                <div>{candidature?.firstName}</div>
                <div>{candidature?.lastName}</div>
              </div>
              <div className="text-xl">{candidature?.email}</div>
              <div className="text-lg text-gray-500">{candidature?.mobile}</div>
              <div className="flex space-x-2 mt-1">
                {candidature?.github && (
                  <Link href={candidature.github} target="_blank">
                    <GithubLogo />
                  </Link>
                )}
                {candidature?.linkedin && (
                  <Link href={candidature.linkedin} target="_blank">
                    <LinkedinLogo />
                  </Link>
                )}
              </div>
            </div>
            <div className="hidden md:block text-xl lg:text-4xl font-bold text-mc text-right">
              {candidature?.title}
            </div>
          </div>
          <div className="space-y-12 mt-12">
            <div>
              <p className="text-2xl text-mc">Ville</p>
              <p className="text-lg">{candidature?.city}</p>
              {candidature?.remote ? (
                <p className="text-lg text-gray-500">Ouvert au télétravail</p>
              ) : (
                <></>
              )}
            </div>
            <div>
              <p className="text-2xl text-mc">Éxperiences</p>
              <div>
                {candidature?.experiences?.map((experience) => {
                  return (
                    <div key={uuidv4()} className="mt-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold text-lg">{experience.job}</p>
                          <p className="text-gray-500">{experience.companyName}</p>
                        </div>
                        <div className="flex space-x-4 items-center">
                          {!experience.endAt ? (
                            <div className="text-sm">En cours</div>
                          ) : (
                            <div className="text-sm">
                              {new Date(experience.startAt).toLocaleDateString()} -{' '}
                              {new Date(experience.endAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      {experience.missions.length ? (
                        <div className="mt-2">
                          <ul className="list-disc ml-4">
                            {experience.missions?.map((mission) => {
                              return mission.mission === '' ? (
                                <p key={uuidv4()}></p>
                              ) : (
                                <li key={uuidv4()}>{mission.mission}</li>
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
            <div>
              <p className="text-2xl text-mc">Parcours scolaire</p>
              <div>
                {candidature?.schools?.map((school) => {
                  return (
                    <div key={uuidv4()} className="mt-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold text-lg">{school.title}</p>
                          <p className="text-gray-500">{school.universityName}</p>
                        </div>
                        <div className="flex space-x-4 items-center">
                          {!school.endAt ? (
                            <div className="text-sm">En cours</div>
                          ) : (
                            <div className="text-sm">
                              {new Date(school.startAt).toLocaleDateString()} -{' '}
                              {new Date(school.endAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">{school.description}</div>
                    </div>
                  )
                })}
              </div>
            </div>
            {candidature?.experiencesAsso?.length ? (
              <div>
                <p className="text-2xl text-mc">Associations</p>
                <div>
                  {candidature.experiencesAsso.map((association) => {
                    return (
                      <div key={uuidv4()} className="mt-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-semibold text-lg">{association.job}</p>
                            <p className="text-gray-500">{association.name}</p>
                          </div>
                          <div className="flex space-x-4 items-center">
                            {!association.endAt ? (
                              <div className="text-sm">En cours</div>
                            ) : (
                              <div className="text-sm">
                                {new Date(association.startAt).toLocaleDateString()} -{' '}
                                {new Date(association.endAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        {association.missions.length ? (
                          <div className="mt-2">
                            <ul className="list-disc ml-4">
                              {association.missions?.map((mission) => {
                                return mission.mission === '' ? (
                                  <p key={uuidv4()}></p>
                                ) : (
                                  <li key={uuidv4()}>{mission.mission}</li>
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
              <p className="text-2xl text-mc">Compétences</p>
              <div className="md:grid md:grid-cols-2 gap-8">
                {candidature?.competenceByType?.map((competence) => {
                  return (
                    <div key={uuidv4()} className="mt-4">
                      <div>
                        <div className="font-semibold text-xl">
                          {getSelectValue(competence.type)}
                        </div>
                        <ul className="list-disc ml-4">
                          {competence.descriptions.map((description) => {
                            return (
                              description !== '' && <li key={uuidv4()}>{description}</li>
                            )
                          })}
                        </ul>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div>
              <p className="text-2xl text-mc">Langues</p>
              <div className="md:grid md:grid-cols-2 gap-8">
                <ul className="list-disc ml-4">
                  {candidature?.languages?.map((language) => {
                    return (
                      <li key={uuidv4()}>
                        <div className="flex space-x-1">
                          <p className="font-semibold">{language.language} -</p>
                          <p>{getLangLevelValueByEnum(language.level)}</p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
            {candidature?.passions?.length ? (
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
            {isReviewer && candidature?.ReviewRequest && (
              <>
                <button className="btn btn-error mt-4" onClick={() => setVisible(true)}>
                  Refuser
                </button>
                {!candidature?.ReviewRequest?.approved && (
                  <button
                    className={`btn btn-success mt-4`}
                    onClick={() =>
                      addReview?.({ id: candidature?.id || '', approved: true })
                    }
                  >
                    Valider
                  </button>
                )}
              </>
            )}
            {candidature && !candidature?.ReviewRequest && (
              <button
                onClick={() => askReview({ id: candidature?.id || '' })}
                className="btn btn-primary mt-4"
              >
                Demander la vérification
              </button>
            )}
            <Link href={`/cv/${candidature?.id}`}>
              <button className="btn btn-primary mt-4">Éditer</button>
            </Link>
          </div>
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
              addReview?.({
                id: candidature?.id || '',
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
