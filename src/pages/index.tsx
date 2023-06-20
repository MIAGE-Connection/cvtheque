import { Hero } from 'components/Hero'
import { StudentHomePage } from 'components/homepage/StudentHomePage'
import { useSession } from 'next-auth/react'
import { NextPageWithLayout } from './_app'

const IndexPage: NextPageWithLayout = () => {
  const { data: session } = useSession()

  const isStudent = session?.user?.role === 'USER' || session?.user?.role === 'REVIEWER'

  return (
    <>
      <div id="content">
        <Hero />
        <div className="divider" />
        {isStudent && <StudentHomePage />}
      </div>
    </>
  )
}

export default IndexPage
