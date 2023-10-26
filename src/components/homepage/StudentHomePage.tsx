import { CVDetails } from 'components/CVDetails'
import { getAdaptedCandidature } from 'components/utils'
import Link from 'next/link'
import { trpc } from 'utils/trpc'

export const StudentHomePage: React.FC = () => {
  const { data: candidature } = trpc.candidature.getByUser.useQuery()

  const cvExist = !!candidature?.id

  return (
    <div>
      <div className="divider" />
      <div>
        {!cvExist ? (
          <div>
            <p className="font-bold text-3xl">Mon CV</p>
          </div>
        ) : (
          <div className="space-y-2 md:space-y-0 md:flex md:justify-between md:items-center">
            <p className="font-bold text-3xl link">
              <Link href={`list/${candidature.id}`}>Mon CV</Link>
            </p>
            {candidature.reviewState === 'pending' && (
              <div className="btn btn-info cursor-default w-full md:w-fit">
                En attente de vérification
              </div>
            )}
            {candidature.reviewState === 'approved' && (
              <div className="btn btn-success cursor-default w-full md:w-fit">Publié</div>
            )}
          </div>
        )}
        {!cvExist && (
          <div>
            <p>
              Vous n&apos;avez pas encore déposé de candidature, vous pouvez le faire en{' '}
              <Link href="/cv" className="link text-mc">
                cliquant via ce lien
              </Link>
            </p>
          </div>
        )}
        {!candidature ? (
          <CVDetails size="center" />
        ) : (
          <CVDetails
            size="center"
            candidature={getAdaptedCandidature(candidature)}
            showButton={true}
          />
        )}
      </div>
    </div>
  )
}
