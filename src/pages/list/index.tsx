import { CandidatureList } from 'components/CandidatureList'
import Spin from 'components/Spin'
import { trpc } from 'utils/trpc'

const List: React.FC = () => {
  const { data: candidatures, isFetching } = trpc.candidature.list.useQuery()

  return (
    <div>
      <h1 className="font-bold text-3xl text-center mt-4 text-mc">Liste des CVs</h1>
      <div className="mt-4 mx-16">
        {candidatures && !isFetching ? (
          <CandidatureList candidatures={candidatures} />
        ) : (
          <Spin />
        )}
      </div>
    </div>
  )
}

export default List
