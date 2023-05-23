import Whisky from 'components/Whisky'
import { useSession } from 'next-auth/react'
import { trpc } from 'utils/trpc'

const Profile: React.FC = () => {
  const { data: profile } = trpc.user.profile.useQuery()
  const { data: session } = useSession()
  return (
    <div className="m-2 space-y-1">
      <div className="flex justify-between">
        <div className="flex items-center space-x-1 text-4xl">
          {session?.user?.image ? (
            <img className="w-10" src={session.user.image} />
          ) : (
            <p>😀</p>
          )}
          <div className="justify-between flex-col">
            <p className="h-2/3 text-base font-bold">{profile?.user.name}</p>
            <p className="h-1/3 text-xs mb-1">{profile?.user.email}</p>
          </div>
        </div>
        <div className="flex items-center text-xs text-gray-800">
          {new Intl.DateTimeFormat('fr-FR').format(profile?.user.createdAt)}
        </div>
      </div>
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-title">Likes</div>
          <div className="stat-value">{profile?.whiskysLiked.total}</div>
          {/* <div className="stat-desc">
            {profile?.whiskysLiked.total} whiskys sauvegardé ce mois
          </div> */}
        </div>

        <div className="stat">
          <div className="stat-title">Note moyenne</div>
          <div className="stat-value">{profile?.averageWhiskyRating ?? 0}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Whiskys sauvegarder ce mois</div>
          <div className="stat-value">{profile?.whiskysLiked.pastMonth}</div>
          <div className="stat-desc">
            ↗︎ {profile?.whiskysLiked.pastMonthPercentage} %
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-xl font-bold">Mes whiskys:</h1>
        <ul className="mt-2 space-y-2">
          {profile?.whiskysSaved.map((whisky) => (
            <Whisky key={whisky.id} whisky={whisky} />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Profile
