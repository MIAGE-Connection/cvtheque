import { CandidatureKind, CompetenceType, Event } from '@prisma/client'
import { prisma } from 'server/prisma'
import { getCompetencesByType, isUserReviewer } from 'utils/utils'
import { z } from 'zod'
import { authedProcedure, publicProcedure, router } from '../trpc'
import { eventService } from './events/events.service'

export const candidatureRouter = router({
  add: authedProcedure
    .input(
      z.object({
        id: z.string().nullish(),
        firstName: z.string(),
        lastName: z.string(),
        city: z.string(),
        info: z.string().nullish(),
        title: z.string(),
        email: z.string(),
        remote: z.boolean(),
        mobile: z.string().nullish(),
        passions: z.string().nullish(),
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
            missions: z.array(
              z.object({
                mission: z.string(),
              }),
            ),
          }),
        ),
        experiencesAsso: z.array(
          z.object({
            startAt: z.date(),
            endAt: z.date().nullish(),
            name: z.string(),
            missions: z.array(
              z.object({
                mission: z.string(),
              }),
            ),
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
        experiencesAsso,
        schools,
        info,
        kind,
        title,
        competences,
        email,
        remote,
        mobile,
        passions,
      } = input

      const { role: role, email: userEmail } = ctx.user

      const experiencesFormatted = experiences.map((e) => {
        return { ...e, missions: e.missions.map((m) => m.mission) }
      })

      const experiencesAssoFormatted = experiencesAsso.map((e) => {
        return { ...e, missions: e.missions.map((m) => m.mission) }
      })

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
            passions,
            User: {
              connect: {
                email: userEmail,
              },
            },
            schools: { createMany: { data: schools } },
            experiences: {
              createMany: {
                data: experiencesFormatted,
              },
            },
            ExperienceAsso: {
              createMany: {
                data: experiencesAssoFormatted,
              },
            },
            Competences: { createMany: { data: competences } },
          },
        })
        return candidature
      }
      const isReviewer = isUserReviewer(role)

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
          passions,
          Competences: { deleteMany: {}, createMany: { data: competences } },
          experiences: {
            deleteMany: {},
            createMany: {
              data: experiencesFormatted,
            },
          },
          ExperienceAsso: {
            deleteMany: {},
            createMany: {
              data: experiencesAssoFormatted,
            },
          },
          schools: { deleteMany: {}, createMany: { data: schools } },
        },
      })

      // Update ReviewRequest if exists

      const ReviewRequest = await prisma.reviewRequest.findFirst({
        where: {
          candidatureId: id,
        },
      })

      if (ReviewRequest) {
        await prisma.reviewRequest.update({
          where: {
            id: ReviewRequest.id,
          },
          data: {
            approved: isReviewer,
          },
        })
      }

      return candidature
    }),
  list: publicProcedure.query(async () => {
    const candidatures = await prisma.candidature.findMany({
      include: {
        Competences: true,
      },
      where: {
        ReviewRequest: {
          approved: true,
        },
      },
    })

    return candidatures
  }),
  details: authedProcedure
    .input(z.object({ id: z.string().uuid(), viewed: z.boolean().optional() }))
    .query(async ({ input, ctx }) => {
      const { role, email } = ctx.user
      const { id, viewed } = input
      const candidature = await prisma.candidature.findUnique({
        where: { id },
        include: {
          experiences: true,
          ExperienceAsso: true,
          schools: true,
          Competences: true,
          ReviewRequest: true,
          User: {
            select: {
              email: true,
            },
          },
        },
      })

      if (!candidature) {
        throw new Error('No candidature found')
      }

      if (viewed && role === 'PARTNER') {
        await eventService.addEvent({
          event: Event.VIEW,
          email: email,
          candidatureId: candidature.id || '',
        })
      }

      const competences = candidature.Competences

      const competenceByType = getCompetencesByType(competences)

      return {
        ...candidature,
        competenceByType,
        isOwner: candidature?.User[0].email === email,
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
      include: {
        experiences: true,
        schools: true,
        Competences: true,
        ExperienceAsso: true,
        ReviewRequest: true,
      },
    })

    const candidature = candidatures[0]

    const competences = candidature?.Competences

    const competencesByType = competences ? getCompetencesByType(competences) : []

    const reviewState = candidature?.ReviewRequest
      ? candidature.ReviewRequest.approved
        ? ('approved' as const)
        : ('pending' as const)
      : ('none' as const)

    return {
      ...candidature,
      competenceByType: competencesByType,
      reviewState,
    }
  }),
  askReview: authedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const { id } = input

      const candidature = await prisma.candidature.update({
        where: { id },
        data: {
          ReviewRequest: {
            create: {
              candidatureId: id,
            },
          },
        },
      })

      return candidature
    }),
})
