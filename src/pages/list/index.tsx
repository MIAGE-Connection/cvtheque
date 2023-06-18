import Spin from 'components/Spin'
import Link from 'next/link'
import { trpc } from 'utils/trpc'
import { getCompetencesByType, getSelectValue } from 'utils/utils'

const List: React.FC = () => {
  const { data: list, isFetching } = trpc.candidature.list.useQuery()

  const headers: JSX.Element = (
    <>
      <th className="text-xl bg-mc text-white">Nom</th>
      <th className="text-xl bg-mc text-white">Poste</th>
      <th className="text-xl bg-mc text-white">Ville</th>
      <th className="text-xl bg-mc text-white">Compétences</th>
      <th className="text-xl bg-mc text-white"></th>
    </>
  )

  return (
    <div>
      <h1 className="font-bold text-3xl text-center mt-4 text-mc">Liste des CVs</h1>
      <div className="mt-4 mx-16">
        {isFetching ? (
          <Spin />
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full text-lg border rounded-xl">
              <thead>
                <tr>{headers}</tr>
              </thead>
              <tbody>
                {list?.map((candidature) => {
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
                        {getCompetencesByType(candidature.Competences)
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
        )}
      </div>
    </div>
  )
}

export default List
