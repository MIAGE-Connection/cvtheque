/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { TRPCError } from '@trpc/server'
import { prisma } from 'server/prisma'
import { authedProcedure, router } from '../trpc'

export const userRouter = router({
  profile: authedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.email) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: `You must be logged in to see your profile`,
      })
    }
    const user = await prisma.user.findUnique({
      where: {
        email: ctx.user.email,
      },
    })
    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: `Cannot find account for mail ${ctx.user.email}`,
      })
    }

    return []
  }),
})
