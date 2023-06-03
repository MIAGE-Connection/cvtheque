/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { prisma } from 'server/prisma'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { CandidatureKind, CompetenceType } from '@prisma/client'
export const candidatureRouter = router({
  add: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        city: z.string(),
        info: z.string().nullish(),
        title: z.string(),
        kind: z.enum([
          CandidatureKind.ALTERNANCE,
          CandidatureKind.CDI,
          CandidatureKind.STAGE,
        ]),
        experiences: z.array(
          z.object({
            startAt: z.date(),
            endAt: z.date().nullish(),
            companyName: z.string(),
            missions: z.array(z.string()),
          }),
        ),
        schools: z.array(
          z.object({
            startAt: z.date(),
            endAt: z.date().nullish(),
            universityName: z.string(),
            description: z.string(),
          }),
        ),
        competences: z.array(
          z.object({
            description: z.string(),
            type: z.enum([
              CompetenceType.FRONTEND,
              CompetenceType.BACKEND,
              CompetenceType.DEVOPS,
              CompetenceType.MOBILE,
              CompetenceType.DESIGN,
              CompetenceType.MANAGEMENT,
              CompetenceType.MARKETING,
              CompetenceType.COMMUNICATION,
              CompetenceType.SALES,
              CompetenceType.BUSINESS,
              CompetenceType.SOFTSKILLS,
              CompetenceType.AGILE,
              CompetenceType.PROJECT_MANAGEMENT,
              CompetenceType.OTHER,
            ]),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      const {
        firstName,
        lastName,
        city,
        experiences,
        schools,
        info,
        kind,
        title,
        competences,
      } = input
      const candidature = await prisma.candidature.create({
        data: {
          firstName,
          lastName,
          city,
          info,
          kind,
          title,
          remote: false,
          schools: { createMany: { data: schools } },
          experiences: { createMany: { data: experiences } },
          Competences: { createMany: { data: competences } },
        },
      })
      return candidature
    }),
  list: publicProcedure.query(async ({}) => {
    const candidatures = await prisma.candidature.findMany({})
    return candidatures
  }),
  details: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const candidature = await prisma.candidature.findUnique({
        where: { id: input.id },
        include: { experiences: true, schools: true, Competences: true },
      })

      const competences = candidature?.Competences

      const competencesByType = competences?.reduce((acc, competence) => {
        const type = competence.type
        if (!acc[type]) {
          acc[type] = []
        }
        acc[type].push(competence)
        return acc
      }, {} as Record<CompetenceType, typeof competences>)

      return {
        ...candidature,
        Competence: competencesByType,
      }
    }),
})
