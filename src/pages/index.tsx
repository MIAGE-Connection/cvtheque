import { Hero } from 'components/Hero'
import { StudentHomePage } from 'components/homepage/StudentHomePage'
import { useSession } from 'next-auth/react'
import { NextPageWithLayout } from './_app'
import { CVDetails } from 'components/CVDetails'

const IndexPage: NextPageWithLayout = () => {
  const { data: session } = useSession()

  const isStudent =
    session?.user?.role === 'USER' ||
    session?.user?.role === 'REVIEWER' ||
    session?.user?.role === 'ADMIN'

  return (
    <>
      <div id="content" className="space-y-4">
        <Hero />
        {!session && (
          <>
            <div className="divider" />
            <CVDetails
              size="center"
              candidature={{
                firstName: 'Prénom',
                lastName: 'Nom',
                email: 'email@miage-connection.fr',
                city: 'Lille',
                github: 'https://github.com/',
                linkedin: 'https://www.linkedin.com/in/',
                languages: [
                  {
                    language: 'Français',
                    level: 'FLUENT',
                  },
                ],
                experiences: [
                  {
                    companyName: 'Entreprise',
                    job: 'Développeur web fullstack',
                    startAt: new Date().toString(),
                    missions: [],
                  },
                ],
                schools: [
                  {
                    universityName: 'Université de Lille',
                    description: 'Master MIAGE',
                    title: 'Master MIAGE 2',
                    startAt: new Date().toString(),
                  },
                ],
                competenceByType: [
                  {
                    type: 'REACT',
                    descriptions: ["Développement d'application web"],
                  },
                  {
                    type: 'DOCKER',
                    descriptions: ['Déploiement, intégration continue'],
                  },
                ],
              }}
            />
          </>
        )}
        {isStudent && <StudentHomePage />}
      </div>
    </>
  )
}

export default IndexPage
