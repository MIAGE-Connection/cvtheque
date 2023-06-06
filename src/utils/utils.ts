import { CompetenceType, Competences } from '@prisma/client'
import { Maybe } from '@trpc/server'

type CandidatureByType = {
  type: CompetenceType
  descriptions: string[]
}

export const getCompetencesByType = (
  competences: Pick<Competences, 'description' | 'type'>[],
): CandidatureByType[] => {
  const competencesByType: CandidatureByType[] = []

  Object.keys(CompetenceType).forEach((key) => {
    const competenceByType = competences?.filter((c) => c.type === key)
    competencesByType.push({
      type: key as CompetenceType,
      descriptions: competenceByType
        ? competenceByType.map((c) => c.description || '')
        : [''],
    })
  })

  return competencesByType.filter(
    (c) => c.descriptions.every((d) => d !== '') && c.descriptions.length > 0,
  )
}

function isValidDate(date: Date) {
  return !isNaN(date.getTime())
}

/**
 * Create a date YYYY-MM-DD date string that is typecasted as a `Date`.
 * Hack when using `defaultValues` in `react-hook-form`
 * This is because `react-hook-form` doesn't support `defaultValue` of type `Date` even if the types say so
 */
export function dateToInputDate(date?: Maybe<Date>) {
  if (!date || !isValidDate(date)) {
    return undefined
  }
  return date.toJSON().slice(0, 10) as unknown as Date
}

export const getSelectValue = (competence: CompetenceType): string => {
  switch (competence) {
    case 'FRONTEND':
      return 'Frontend'
    case 'BACKEND':
      return 'Backend'
    case 'DEVOPS':
      return 'Devops'
    case 'MOBILE':
      return 'Mobile'
    case 'DESIGN':
      return 'Design'
    case 'MANAGEMENT':
      return 'Management'
    case 'MARKETING':
      return 'Marketing'
    case 'COMMUNICATION':
      return 'Communication'
    case 'SALES':
      return 'Sales'
    case 'BUSINESS':
      return 'Business'
    case 'SOFTSKILLS':
      return 'Softskills'
    case 'AGILE':
      return 'Agile'
    case 'PROJECT_MANAGEMENT':
      return 'Project management'
    case 'BUSINESS_INTELLIGENCE':
      return 'Business intelligence'
    case 'NETWORK':
      return 'Network'
    case 'OTHER':
      return 'Other'
    default:
      return 'Other'
  }
}
