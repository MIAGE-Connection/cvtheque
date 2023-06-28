import Spin from 'components/Spin'
import Link from 'next/link'
import { trpc } from 'utils/trpc'

const Stats: React.FC = () => {
  const { data } = trpc.candidature.stats.useQuery()

  if (!data) {
    return <Spin />
  }

  const { added, total, reviewers, partners, statsView } = data

  const getPercentageString = (lastMonth: number, thisMonth: number) => {
    const percentage = lastMonth > 0 ? thisMonth / lastMonth : thisMonth
    if (percentage > 0) {
      return `+${(percentage * 100).toFixed(0)}%`
    } else if (percentage < 0) {
      return `-${(percentage * 100).toFixed(0)}%`
    } else {
      return '0%'
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Candidatures</h1>
      <div className="stats lg:grid lg:grid-cols-3 shadow stats-vertical lg:stats-horizontal w-full">
        <div className="stat">
          <div className="stat-figure text-primary text-4xl">➕</div>
          <div className="stat-title">Candidature déposées ce mois</div>
          <div className="stat-value text-primary">{added.thisMonth}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-secondary text-4xl">📈</div>
          <div className="stat-value text-mc">
            {getPercentageString(added.lastMonth, added.thisMonth)}
          </div>
          <div className="stat-title text-ellipsis">Comparé au mois précédent</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-primary text-4xl">📝</div>
          <div className="stat-title">Total des candidatures déposées</div>
          <div className="stat-value text-primary">{total}</div>
        </div>
      </div>
      <h1 className="text-2xl font-bold">Vues</h1>
      <div className="stats lg:grid lg:grid-cols-3 shadow stats-vertical lg:stats-horizontal w-full">
        <div className="stat">
          <div className="stat-figure text-primary text-4xl">➕</div>
          <div className="stat-title">Vues sur les candidatures ce mois</div>
          <div className="stat-value text-primary">
            {statsView.statsViewByMonth.thisMonth}
          </div>
        </div>
        <div className="stat">
          <div className="stat-figure text-secondary text-4xl">🔥</div>
          <div className="stat-value text-mc">
            {getPercentageString(
              statsView.statsViewByMonth.lastMonth,
              statsView.statsViewByMonth.thisMonth,
            )}
          </div>
          <div className="stat-title">Vues comparé au mois précédent</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-primary text-4xl">👀</div>
          <div className="stat-title">Total des vues</div>
          <div className="stat-value text-primary">{total}</div>
        </div>
      </div>
      <h1 className="text-2xl font-bold">Validateurs & Partenaires</h1>
      <div className="space-y-4 lg:space-y-0 lg:space-x-4 lg:grid lg:grid-cols-2">
        <div className="card card-bordered">
          <div className="card-body">
            <h2 className="card-title">Validateurs</h2>
            <ul className="list-disc grid grid-cols-2">
              {reviewers?.map((reviewer) => (
                <li key={reviewer}>
                  <p>{reviewer}</p>
                </li>
              ))}
            </ul>
            <div className="card-actions justify-end">
              <Link href="/users?search=REVIEWER">
                <button className="btn btn-primary">Voir plus</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="card card-bordered">
          <div className="card-body">
            <h2 className="card-title">Partenaires</h2>
            <ul className="list-disc grid grid-cols-2">
              {partners?.map((partner) => (
                <li key={partner}>
                  <p>{partner}</p>
                </li>
              ))}
            </ul>
            <div className="card-actions justify-end">
              <Link href="/users?search=PARTNER">
                <button className="btn btn-primary">Voir plus</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stats
