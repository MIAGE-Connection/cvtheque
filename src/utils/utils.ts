import { CompetenceType, LangLevel, Role } from '@prisma/client'
import { Maybe } from '@trpc/server'

export type CandidatureCompetencesByType = {
  type: CompetenceType
  descriptions: string[]
}

export const isUserReviewer = (role?: Role) => role === 'REVIEWER' || role === 'ADMIN'

export const isUserPartner = (role?: Role) =>
  role === 'PARTNER' || role === 'ADMIN' || role === 'REVIEWER'

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
  return date.toJSON().slice(0, 10) as unknown as string
}

export const getLangLevelValueByEnum = (level: LangLevel): string => {
  switch (level) {
    case 'BEGINNER':
      return 'Débutant'
    case 'INTERMEDIATE':
      return 'Intermédiaire'
    case 'ADVANCED':
      return 'Avancé'
    case 'FLUENT':
      return 'Courant'
    case 'NATIVE':
      return 'Langue maternelle'
    default:
      return 'Débutant'
  }
}
