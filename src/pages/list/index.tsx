import Spin from 'components/Spin'
import Link from 'next/link'
import { trpc } from 'utils/trpc'

const List: React.FC = () => {
  /* const { data: profile } = trpc.user.profile.useQuery()
    const { data: session } = useSession() */

  const { data: list, isFetching } = trpc.candidature.list.useQuery()

  const headers: JSX.Element = (
    <>
      <th className="text-xl bg-mc text-white">Nom</th>
      <th className="text-xl bg-mc text-white">Poste</th>
      <th className="text-xl bg-mc text-white">Ville</th>
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
                <tr>
                  {/* <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th> */}
                  {headers}
                </tr>
              </thead>
              <tbody>
                {list?.map((candidature) => {
                  return (
                    <tr key={candidature.id}>
                      {/*    <div
                      key={candidature.id}
                      className="border rounded-xl w-10/12 px-8 py-2"
                    >
                      <div className="grid grid-cols-5">
                        <div className="flex space-x-2 font-semibold">
                          <p>{candidature.firstName}</p>
                          <p>{candidature.lastName}</p>
                        </div>
                        <div className="text-center font-bold">{candidature.title}</div>
                        <div className="text-center">{candidature.city}</div>
                        <div className="text-center">
                          {
                            {
                              ALTERNANCE: 'Alternance',
                              STAGE: 'Stage',
                              CDI: 'CDI',
                            }[candidature.kind]
                          }
                        </div>
                        <Link
                          href={`list/${candidature.id}`}
                          className="text-right link link-primary"
                        >
                          Voir plus
                        </Link>
                      </div>
                    </div> */}

                      {/* head */}

                      {/*  <th>
                        <label>
                          <input type="checkbox" className="checkbox" />
                        </label>
                      </th> */}

                      <td>
                        {candidature.firstName} {candidature.lastName}
                        <br />
                        <span className="badge badge-ghost badge-sm">
                          {candidature.email || 'Aucun email'}
                        </span>
                      </td>
                      <td>{candidature.title}</td>
                      <td>{candidature.city}</td>

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
                      {/* foot */}
                    </tr>
                  )
                })}
              </tbody>

              {/* <tfoot>
                <tr>{headers}</tr>
              </tfoot> */}
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default List
