import { prisma } from 'server/prisma'
import { z } from 'zod'
import { authedProcedure, authedReviewerProcedure, router } from '../trpc'

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
