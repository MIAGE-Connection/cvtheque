import { prisma } from 'server/prisma'
import { z } from 'zod'
import { authedProcedure, authedReviewerProcedure, router } from '../trpc'
import { mailService } from './mail/mail.service'

export const reviewRouter = router({
  create: authedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const { id } = input

      const reviewRequest = await prisma.reviewRequest.create({
        data: {
          candidatureId: id,
        },
        include: {
          candidature: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      })

      const candidature = await prisma.candidature.findUnique({
        where: {
          id,
        },
        select: {
          firstName: true,
          lastName: true,
        },
      })

      if (!candidature) {
        throw new Error('Candidature not found')
      }

      mailService.sendCandidatureToReviewEmail({
        candidatureId: reviewRequest.candidatureId,
        fullname: `${candidature.firstName} ${candidature.lastName}`,
      })

      return reviewRequest
    }),
  save: authedReviewerProcedure
    .input(
      z.object({
        id: z.string(),
        approved: z.boolean(),
        description: z.string().nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id, description, approved } = input

      const userEmail = ctx.user.email || ''

      const user = await prisma.user.findUnique({
        where: {
          email: userEmail,
        },
        select: {
          id: true,
        },
      })

      if (!user) {
        throw new Error('User not found')
      }

      await prisma.reviewRequest.update({
        where: {
          id,
        },
        data: {
          approved,
          description: description || '',
          reviewerId: user.id,
        },
      })

      if (approved) {
        mailService.sendCandidatureValidatedEmail({
          candidatureId: id,
          email: userEmail,
        })
      }

      return { approved }
    }),
  findAll: authedReviewerProcedure.query(async () => {
    const candidatures = await prisma.candidature.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        title: true,
        city: true,
        email: true,
        kind: true,
        ReviewRequest: {
          select: {
            id: true,
            approved: true,
            reviewer: true,
          },
        },
        Competences: true,
      },
    })

    const toReview = candidatures.filter(
      (candidature) => !candidature.ReviewRequest?.approved,
    )

    const old = candidatures.filter((candidature) => candidature.ReviewRequest?.approved)

    return {
      toReview,
      old,
    }
  }),
})
