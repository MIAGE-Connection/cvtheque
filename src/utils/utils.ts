import { CompetenceType, Competences } from '@prisma/client'

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
