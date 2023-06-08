import Spin from 'components/Spin'
import Link from 'next/link'
import { trpc } from 'utils/trpc'

const Reviews: React.FC = () => {
  const { data: candidatures, isLoading } = trpc.review.findAll.useQuery()

  const { old, toReview } = candidatures || { old: [], toReview: [] }

  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <div className="px-16">
          <h1 className="text-xl text-center my-16 font-bold">
            CV en attente de vérification
          </h1>

          <table className="table w-full text-lg border rounded-xl ">
            <thead>
              <tr>
                <th className="text-xl bg-mc text-white">Nom</th>
                <th className="text-xl bg-mc text-white">Titre</th>
                <th className="text-xl bg-mc text-white">Ville</th>
                <th className="text-xl bg-mc text-white"></th>
              </tr>
            </thead>
            <tbody>
              {toReview?.map((candidature) => {
                return (
                  <tr key={candidature.id}>
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
                  </tr>
                )
              })}
            </tbody>
          </table>
          <h1 className="text-xl text-center my-8 font-bold">CV Publié</h1>
          <table className="table w-full text-lg border rounded-xl ">
            <thead>
              <tr>
                <th className="text-xl bg-mc text-white">Nom</th>
                <th className="text-xl bg-mc text-white">Titre</th>
                <th className="text-xl bg-mc text-white">Ville</th>
                <th className="text-xl bg-mc text-white">Accepté par</th>
                <th className="text-xl bg-mc text-white"></th>
              </tr>
            </thead>
            <tbody>
              {old?.map((candidature) => {
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
                    <td>{candidature.ReviewRequest?.reviewer?.email}</td>

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
    </>
  )
}

export default Reviews
