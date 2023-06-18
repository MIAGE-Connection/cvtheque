import { prisma } from 'server/prisma'
import { authedAdminProcedure, router } from '../trpc'
import { z } from 'zod'
import { Role } from '@prisma/client'
export const userRouter = router({
  findAll: authedAdminProcedure.query(() => {
    return prisma.user.findMany({
      orderBy: {
        role: 'asc',
      },
    })
  }),

  updateRole: authedAdminProcedure
    .input(
      z.object({
        email: z.string().email(),
        role: z.nativeEnum(Role),
      }),
    )
    .mutation(async ({ input }) => {
      const { email, role } = input
      return prisma.user.update({
        where: {
          email,
        },
        data: {
          role,
        },
      })
    }),
})
