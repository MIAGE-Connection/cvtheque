import { CVDetails } from 'components/CVDetails'
import Spin from 'components/Spin'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from 'pages/_app'
import { trpc } from 'utils/trpc'

const CV: NextPageWithLayout = () => {
  const id = useRouter().query.id as string
  const { data: candidature, isLoading } = trpc.candidature.details.useQuery({
    id,
    viewed: true,
  })
  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        candidature && (
          <CVDetails candidature={candidature} size="center" showButton={true} />
        )
      )}
    </>
  )
}

export default CV
