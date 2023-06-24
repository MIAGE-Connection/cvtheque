import { CompetenceType } from '@prisma/client'
import { useState } from 'react'
import { RouterOutput } from 'utils/trpc'

// write a function to do the same as this :
export type Candidature = Partial<RouterOutput['candidature']['list'][number]>

export const getFilteredCandidatures = (
  candidatures: Candidature[],
  search: string,
  competences: string[],
) => {
  const filteredCandidatures = candidatures.filter((candidature) => {
    const searchLower = search.toLowerCase()
    const fullName = `${candidature.firstName} ${candidature.lastName}`
    const title = candidature.title
    const city = candidature.city
    const competencesString = candidature.Competences?.map((c) => c.type).join(' ')
    const isInCompetencesType = competences.length
      ? candidature.Competences?.some((c) => competences.includes(c.type))
      : true

    return (
      (fullName.toLowerCase().includes(searchLower) ||
        title?.toLowerCase().includes(searchLower) ||
        competencesString?.toLowerCase().includes(searchLower) ||
        city?.toLowerCase().includes(searchLower)) &&
      isInCompetencesType
    )
  })

  return filteredCandidatures
}

export const useFilteredCandidatures = (candidatures: Candidature[]) => {
  const [search, setSearch] = useState('')
  const [competences, setCompetences] = useState<CompetenceType[]>([])

  const filteredCandidatures = getFilteredCandidatures(candidatures, search, competences)

  return {
    filteredCandidatures,
    search,
    setSearch,
    competences,
    setCompetences,
  }
}
