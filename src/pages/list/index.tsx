import Spin from 'components/Spin'
import Link from 'next/link'
import { trpc } from 'utils/trpc'

const List: React.FC = () => {
  /* const { data: profile } = trpc.user.profile.useQuery()
    const { data: session } = useSession() */

  const { data: list, isFetching } = trpc.candidature.list.useQuery()
  return (
    <div>
      <h1 className="font-bold text-2xl text-center">Liste des CVs</h1>
      <div className="flex flex-col items-center space-y-4">
        {isFetching ? (
          <Spin />
        ) : (
          list?.map((candidature) => {
            return (
              <div key={candidature.id} className="border rounded-xl w-10/12 px-8 py-2">
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
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default List
