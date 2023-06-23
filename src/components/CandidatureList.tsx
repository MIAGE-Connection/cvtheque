import { CompetenceType } from '@prisma/client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { RouterOutput } from 'utils/trpc'
import { getCompetencesByType, getSelectValue } from 'utils/utils'

type Candidatures = Partial<RouterOutput['candidature']['list'][number]>

type Props = {
  candidatures: Candidatures[]
}
export const CandidatureList: React.FC<Props> = ({ candidatures }) => {
  const headers: JSX.Element = (
    <>
      <th className="text-xl bg-mc text-white rounded-tl-xl">Nom</th>
      <th className="text-xl bg-mc text-white">Poste</th>
      <th className="text-xl bg-mc text-white">Ville</th>
      <th className="text-xl bg-mc text-white">Compétences</th>
      <th className="text-xl bg-mc text-white rounded-tr-xl"></th>
    </>
  )
  const ref = useRef<HTMLDivElement>(null)

  const [search, setSearch] = useState('')
  const [competences, setCompetences] = useState<CompetenceType[]>([])
  const [visible, setVisible] = useState(false)
  const candidaturesFiltered = candidatures.filter((candidature) => {
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

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setVisible(false)
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [visible])

  return (
    <>
      <div className="flex border rounded-xl p-4 mb-4 space-x-4 items-center">
        <div className="space-y-2 w-1/3">
          <p className="text-mc">Recherche</p>
          <input
            className="input input-bordered w-full"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="space-y-2 w-2/3">
          <p className="text-mc">Types de compétences</p>
          <div
            className="input input-bordered w-full flex items-center justify-between"
            onClick={() => setVisible((prev) => !prev)}
          >
            <div className="flex space-x-2 overflow-y-scroll items-center">
              {competences.map((competence) => (
                <div
                  className="flex space-x-[2px] p-2 border rounded-xl"
                  key={competence}
                >
                  <p>{getSelectValue(competence)}</p>{' '}
                  <p
                    className="text-error cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      setCompetences((prev) => prev.filter((c) => c !== competence))
                    }}
                  >
                    x
                  </p>
                </div>
              ))}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-chevron-up w-4 h-4"
              onClick={() => setVisible((prev) => !prev)}
            >
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </div>
          {visible && (
            <div
              className="absolute shadow top-100 bg-white z-40 w-full rounded max-h-select overflow-y-auto max-w-md"
              ref={ref}
            >
              <div className="flex flex-col w-full">
                {Object.values(CompetenceType).map((c) => (
                  <div
                    className={`cursor-pointer w-full ${
                      competences.includes(c) ? 'bg-slate-400' : ''
                    } border-gray-100 rounded-t border-b hover:bg-blue-300`}
                    key={`${c} ${Math.random()}`}
                    onClick={() => {
                      setCompetences((prev) => {
                        if (prev.includes(c)) {
                          return prev.filter((competence) => competence !== c)
                        }
                        return [...prev, c]
                      })
                    }}
                  >
                    <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-blue-300">
                      <div className="w-full items-center flex">
                        <div className="mx-2 leading-6  ">{getSelectValue(c)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full text-lg">
          <thead>
            <tr>{headers}</tr>
          </thead>
          <tbody>
            {candidaturesFiltered?.map((candidature) => {
              return (
                <tr key={candidature.id}>
                  <td>
                    {candidature.firstName} {candidature.lastName}
                    <br />
                    <span className="badge badge-ghost badge-sm text-white">
                      {candidature.email || 'Aucun email'}
                    </span>
                  </td>
                  <td>{candidature.title}</td>
                  <td>{candidature.city}</td>
                  <td>
                    {getCompetencesByType(candidature.Competences || [])
                      .map((c) => getSelectValue(c.type))
                      .join(', ')}
                  </td>

                  <th className="text-center">
                    <button className="btn btn-link">
                      <Link href={`list/${candidature.id}`}>Voir plus</Link>
                    </button>
                  </th>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
