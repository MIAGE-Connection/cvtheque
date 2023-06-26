import { CandidatureList } from 'components/CandidatureList'
import Spin from 'components/Spin'
import { trpc } from 'utils/trpc'

const Reviews: React.FC = () => {
  const { data: candidatures, isLoading } = trpc.review.findAll.useQuery()
  console.log('')

  const { old, toReview } = candidatures || { old: [], toReview: [] }

  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <div>
          <h1 className="text-xl text-center mb-8 font-bold">
            CV en attente de vérification
          </h1>
          <div className="space-y-4">
            {toReview && <CandidatureList candidatures={toReview} />}

            <h1 className="text-xl text-center my-8 font-bold">CV Publié</h1>

            {old && <CandidatureList candidatures={old} />}
          </div>
        </div>
      )}
    </>
  )
}

export default Reviews
