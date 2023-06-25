import Candidature from 'components/Candidature'
import { getAdaptedCandidature } from 'components/utils'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { trpc } from 'utils/trpc'

const CandidatureEdit: React.FC = () => {
  const id = useRouter().query.id as string
  const { data: session } = useSession()
  const { data: candidature } = trpc.candidature.details.useQuery({ id })
  return candidature ? (
    <Candidature
      initialValues={{
        ...getAdaptedCandidature(candidature),
        userEmail: session?.user.email || '',
      }}
    />
  ) : (
    <></>
  )
}

export default CandidatureEdit
