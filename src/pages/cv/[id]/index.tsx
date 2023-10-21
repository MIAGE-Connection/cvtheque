import Candidature from 'components/candidature/Candidature'
import Spin from 'components/Spin'
import { getAdaptedCandidature } from 'components/utils'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { trpc } from 'utils/trpc'

const CandidatureEdit: React.FC = () => {
  const id = useRouter().query.id as string
  const { data: session } = useSession()
  const {
    data: candidature,
    isLoading,
    isFetchedAfterMount,
  } = trpc.candidature.details.useQuery({ id })

  if (!candidature || isLoading || !isFetchedAfterMount) return <Spin />

  return (
    <Candidature
      initialValues={{
        ...getAdaptedCandidature(candidature),
        userEmail: session?.user.email || '',
      }}
    />
  )
}

export default CandidatureEdit
