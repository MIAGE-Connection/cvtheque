/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { CandidatureKind, CompetenceType } from '@prisma/client'
import { prisma } from 'server/prisma'
import { getCompetencesByType } from 'utils/utils'
import { z } from 'zod'
import { authedProcedure, publicProcedure, router } from '../trpc'

export const candidatureRouter = router({
  add: authedProcedure
    .input(
      z.object({
        id: z.string().nullable(),
        firstName: z.string(),
        lastName: z.string(),
        city: z.string(),
        info: z.string().nullish(),
        title: z.string(),
        email: z.string(),
        remote: z.boolean(),
        mobile: z.string().nullish(),
        userEmail: z.string().email(),
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
            type: z.nativeEnum(CompetenceType),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const {
        id,
        firstName,
        lastName,
        city,
        experiences,
        schools,
        info,
        kind,
        title,
        competences,
        email,
        remote,
        mobile,
      } = input
      const { email: userEmail } = ctx.user

      if (!id) {
        const candidature = await prisma.candidature.create({
          data: {
            firstName,
            lastName,
            city,
            info,
            kind,
            title,
            email,
            remote,
            mobile,
            User: {
              connect: {
                email: userEmail,
              },
            },
            schools: { createMany: { data: schools } },
            experiences: { createMany: { data: experiences } },
            Competences: { createMany: { data: competences } },
          },
        })
        return candidature
      }
      const candidature = await prisma.candidature.update({
        where: { id },
        data: {
          firstName,
          lastName,
          city,
          info,
          kind,
          title,
          email,
          remote,
          mobile,
          schools: { deleteMany: {}, createMany: { data: schools } },
          experiences: { deleteMany: {}, createMany: { data: experiences } },
          Competences: { deleteMany: {}, createMany: { data: competences } },
        },
      })
      return candidature
    }),
  list: publicProcedure.query(async () => {
    const candidatures = await prisma.candidature.findMany({
      include: {
        Competences: true,
      },
    })

    return candidatures
  }),
  details: authedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const candidature = await prisma.candidature.findUnique({
        where: { id: input.id },
        include: {
          experiences: true,
          schools: true,
          Competences: true,
          User: {
            select: {
              email: true,
            },
          },
        },
      })

      const competences = candidature?.Competences

      const competencesByType = competences ? getCompetencesByType(competences) : []

      return {
        ...candidature,
        competenceByType: competencesByType,
        isOwner: candidature?.User[0].email === ctx.user.email,
      }
    }),
  getByUser: authedProcedure.query(async ({ ctx }) => {
    const { email } = ctx.user

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new Error('No user found')
    }

    const candidatures = await prisma.candidature.findMany({
      where: {
        User: {
          some: {
            email,
          },
        },
      },
      include: { experiences: true, schools: true, Competences: true },
    })

    const candidature = candidatures[0]

    const competences = candidature?.Competences

    const competencesByType = competences ? getCompetencesByType(competences) : []

    return {
      ...candidature,
      competenceByType: competencesByType,
    }
  }),
})
