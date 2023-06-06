import Candidature from 'components/Candidature'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { trpc } from 'utils/trpc'
import { dateToInputDate } from 'utils/utils'

const CandidatureEdit: React.FC = () => {
  const id = useRouter().query.id as string
  const { data: session } = useSession()
  const { data: candidature } = trpc.candidature.details.useQuery({ id })
  return candidature ? (
    <Candidature
      initialValues={{
        id,
        city: candidature.city || '',
        competences:
          candidature.Competences?.map((c) => {
            return {
              description: c.description,
              type: c.type,
            }
          }) || [],
        email: candidature.email || '',
        experiences:
          candidature.experiences?.map((e) => {
            return {
              companyName: e.companyName,
              endAt: dateToInputDate(e.endAt) || new Date(),
              startAt: dateToInputDate(e.startAt) || new Date(),
              missions: e.missions,
            }
          }) || [],
        firstName: candidature.firstName || '',
        lastName: candidature.lastName || '',
        title: candidature.title || '',
        kind: candidature.kind || 'STAGE',
        schools:
          candidature.schools?.map((s) => {
            return {
              universityName: s.universityName,
              startAt: dateToInputDate(s.startAt) || new Date(),
              endAt: dateToInputDate(s.endAt) || new Date(),
              description: s.description,
            }
          }) || [],
        userEmail: session?.user.email || '',
        mobile: candidature.mobile || '',
        info: candidature.info || '',
        remote: candidature.remote || false,
      }}
    />
  ) : (
    <></>
  )
}

export default CandidatureEdit
