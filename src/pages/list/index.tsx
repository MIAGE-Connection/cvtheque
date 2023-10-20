import { CandidatureList } from 'components/CandidatureList'
import resumeSvg from '../../../public/resume.svg'
import Spin from 'components/Spin'
import { trpc } from 'utils/trpc'
import Image from 'next/image'

const List: React.FC = () => {
  const { data: candidatures, isLoading } = trpc.candidature.list.useQuery()

  if (!candidatures || isLoading) {
    return <Spin />
  }

  return (
    <div>
      <div className="flex justify-center items-center space-x-4">
        <h1 className="font-bold text-xl text-center mt-4 text-mc">Liste des CVs</h1>
        <Image
          src={resumeSvg}
          className={'object-cover w-20'}
          alt="Hero Illustration"
          loading="eager"
        />
      </div>
      <div className="mt-4 lg:mx-16">
        <CandidatureList candidatures={candidatures} />
      </div>
    </div>
  )
}

export default List
