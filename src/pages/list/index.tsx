import { CandidatureList } from 'components/CandidatureList'
import Spin from 'components/Spin'
import { trpc } from 'utils/trpc'

const List: React.FC = () => {
  const { data: candidatures, isLoading } = trpc.candidature.list.useQuery()

  if (!candidatures || isLoading) {
    return <Spin />
  }

  return (
    <div>
      <h1 className="font-bold text-3xl text-center mt-4 text-mc">Liste des CVs</h1>
      <div className="mt-4 mx-16">
        <CandidatureList candidatures={candidatures} />
      </div>
    </div>
  )
}

export default List
