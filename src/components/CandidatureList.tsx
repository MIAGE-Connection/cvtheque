import Link from 'next/link'
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
  return (
    <div className="overflow-x-auto">
      <table className="table w-full text-lg">
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody>
          {candidatures?.map((candidature) => {
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
                  <button className="btn btn-ghost btn-xs">
                    <Link
                      href={`list/${candidature.id}`}
                      className="text-right link link-primary text-lg"
                    >
                      Voir plus
                    </Link>
                  </button>
                </th>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
