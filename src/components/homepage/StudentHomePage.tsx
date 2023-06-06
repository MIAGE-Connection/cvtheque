import { CVDetails } from 'components/CVDetails'
import Link from 'next/link'
import { trpc } from 'utils/trpc'

export const StudentHomePage: React.FC = () => {
  const { data: candidature, isLoading } = trpc.candidature.getByUser.useQuery()

  return (
    <div>
      <div>
        <p className="font-bold text-3xl">Mon CV</p>
      </div>
      {!candidature && (
        <div>
          <p>
            Vous n&apos;avez pas encore déposé de candidature, vous pouvez le faire en{' '}
            <Link href={'/cv'} className="link text-mc">
              cliquant via ce lien
            </Link>
          </p>
        </div>
      )}
      {isLoading ? (
        <CVDetails size="center" candidature={{}} />
      ) : (
        <div>
          <CVDetails
            size="center"
            candidature={{
              ...candidature,
            }}
          />
        </div>
      )}
    </div>
  )
}
