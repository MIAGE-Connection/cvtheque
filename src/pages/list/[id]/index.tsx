import { CVDetails } from 'components/CVDetails'
import Spin from 'components/Spin'
import { getAdaptedCandidature } from 'components/utils'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from 'pages/_app'
import { trpc } from 'utils/trpc'

const CV: NextPageWithLayout = () => {
  const id = useRouter().query.id as string
  const { data: candidature, isLoading } = trpc.candidature.details.useQuery({
    id,
    viewed: true,
  })

  if (!candidature || isLoading) {
    return <Spin />
  }

  return (
    <>
      <Head>
        <title>{`CV de ${candidature?.firstName} ${candidature?.lastName}`}</title>
      </Head>
      <CVDetails
        candidature={getAdaptedCandidature(candidature)}
        size="center"
        showButton={true}
      />
    </>
  )
}

export default CV
