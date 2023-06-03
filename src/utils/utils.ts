import { CompetenceType } from '@prisma/client'

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
