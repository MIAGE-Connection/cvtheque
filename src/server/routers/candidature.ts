import { CandidatureKind, CompetenceType, Event } from '@prisma/client'
import { prisma } from 'server/prisma'
import { getCompetencesByType, isUserReviewer } from 'utils/utils'
import { z } from 'zod'
import {
  authedPartnerProcedure,
  authedProcedure,
  authedReviewerProcedure,
  router,
} from '../trpc'
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
        experiences: z
          .array(
            z.object({
              startAt: z.string(),
              endAt: z.string().nullish(),
              companyName: z.string(),
              missions: z.array(
                z.object({
                  mission: z.string(),
                }),
              ),
            }),
          )
          .optional(),
        experiencesAsso: z
          .array(
            z.object({
              startAt: z.string(),
              endAt: z.string().nullish(),
              name: z.string(),
              missions: z.array(
                z.object({
                  mission: z.string(),
                }),
              ),
            }),
          )
          .optional(),
        schools: z
          .array(
            z.object({
              startAt: z.string(),
              endAt: z.string().nullish(),
              universityName: z.string(),
              description: z.string(),
            }),
          )
          .optional(),
        competences: z
          .array(
            z.object({
              description: z.string(),
              type: z.nativeEnum(CompetenceType),
            }),
          )
          .optional(),
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

      const experiencesFormatted = experiences?.map((e) => {
        return {
          ...e,
          missions: e.missions.map((m) => m.mission),
          startAt: new Date(e.startAt),
          ...(e.endAt && { endAt: new Date(e.endAt) }),
        }
      })

      const experiencesAssoFormatted = experiencesAsso?.map((e) => {
        return {
          ...e,
          missions: e.missions.map((m) => m.mission),
          startAt: new Date(e.startAt),
          ...(e.endAt && { endAt: new Date(e.endAt) }),
        }
      })

      const schoolsFormatted = schools?.map((s) => {
        return {
          ...s,
          startAt: new Date(s.startAt),
          ...(s.endAt && { endAt: new Date(s.endAt) }),
        }
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
            schools: { createMany: { data: schoolsFormatted || [] } },
            experiences: {
              createMany: {
                data: experiencesFormatted || [],
              },
            },
            ExperienceAsso: {
              createMany: {
                data: experiencesAssoFormatted || [],
              },
            },
            Competences: { createMany: { data: competences || [] } },
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
          Competences: { deleteMany: {}, createMany: { data: competences || [] } },
          experiences: {
            deleteMany: {},
            createMany: {
              data: experiencesFormatted || [],
            },
          },
          ExperienceAsso: {
            deleteMany: {},
            createMany: {
              data: experiencesAssoFormatted || [],
            },
          },
          schools: { deleteMany: {}, createMany: { data: schoolsFormatted || [] } },
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
            approved: ReviewRequest.approved ? isReviewer : false,
          },
        })
      }

      return candidature
    }),
  list: authedPartnerProcedure.query(async () => {
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
          experiences: {
            orderBy: {
              startAt: 'desc',
            },
          },
          ExperienceAsso: {
            orderBy: {
              startAt: 'desc',
            },
          },
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
  findByEmail: authedProcedure.query(async ({ ctx }) => {
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
      select: {
        id: true,
      },
    })

    const candidatureId = candidatures[0].id

    return { candidatureId }
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
  stats: authedReviewerProcedure.query(async () => {
    const candidatures = await prisma.candidature.findMany({
      include: {
        ReviewRequest: true,
      },
    })

    const stats = candidatures.reduce(
      (acc, candidature) => {
        if (candidature.ReviewRequest?.approved) {
          acc.reviews.approved += 1
        } else if (candidature.ReviewRequest?.approved === false) {
          acc.reviews.pending += 1
        }

        if (
          candidature.createdAt.getMonth() === new Date().getMonth() &&
          candidature.createdAt.getFullYear() === new Date().getFullYear()
        ) {
          acc.added.thisMonth += 1
        } else if (
          candidature.createdAt.getMonth() === new Date().getMonth() - 1 &&
          candidature.createdAt.getFullYear() === new Date().getFullYear()
        ) {
          acc.added.lastMonth += 1
        }
        return acc
      },
      {
        total: candidatures.length,
        reviews: {
          approved: 0,
          pending: 0,
        },
        added: {
          thisMonth: 0,
          lastMonth: 0,
        },
      },
    )

    const statsView = await prisma.events.findMany({
      where: {
        event: Event.VIEW,
      },
      select: {
        createdAt: true,
      },
    })

    const statsViewByMonth = statsView.reduce(
      (acc, event) => {
        if (
          event.createdAt.getMonth() === new Date().getMonth() &&
          event.createdAt.getFullYear() === new Date().getFullYear()
        ) {
          acc.thisMonth += 1
        } else if (
          event.createdAt.getMonth() === new Date().getMonth() - 1 &&
          event.createdAt.getFullYear() === new Date().getFullYear()
        ) {
          acc.lastMonth += 1
        }
        return acc
      },
      {
        thisMonth: 0,
        lastMonth: 0,
      },
    )

    const reviewersAndPartners = await prisma.user.findMany({
      where: {
        OR: [
          {
            role: 'REVIEWER',
          },
          {
            role: 'PARTNER',
          },
        ],
      },
      select: {
        role: true,
        email: true,
      },
    })

    const { reviewers, partners } = reviewersAndPartners.reduce(
      (acc, user) => {
        if (user.role === 'REVIEWER') {
          acc.reviewers?.push(user.email || '')
        } else if (user.role === 'PARTNER') {
          acc.partners?.push(user.email || '')
        }
        return acc
      },
      {
        reviewers: [] as string[] | undefined,
        partners: [] as string[] | undefined,
      },
    )

    return {
      reviewers,
      partners,
      ...stats,
      statsView: {
        total: statsView.length,
        statsViewByMonth,
      },
    }
  }),
})
