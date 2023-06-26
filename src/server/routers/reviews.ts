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
          Candidature: {
            connect: {
              id,
            },
          },
        },
        include: {
          Candidature: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      })

      mailService.sendCandidatureToReviewEmail({
        candidatureId: reviewRequest.Candidature[0].id,
        fullname: `${reviewRequest.Candidature[0].firstName} ${reviewRequest.Candidature[0].lastName}`,
      })

      return reviewRequest
    }),
  save: authedReviewerProcedure
    .input(
      z.object({
        id: z.string().uuid(),
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

      await prisma.reviewRequest.updateMany({
        where: {
          candidatureId: id,
        },
        data: {
          approved,
          description: description || '',
          reviewerId: user.id,
        },
      })

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
      (candidature) => candidature.ReviewRequest?.approved === false,
    )
    const old = candidatures.filter(
      (candidature) => candidature.ReviewRequest?.approved === true,
    )

    return {
      toReview,
      old,
    }
  }),
})
