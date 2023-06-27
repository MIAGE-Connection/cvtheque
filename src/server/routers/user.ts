import { prisma } from 'server/prisma'
import { authedAdminProcedure, authedProcedure, router } from '../trpc'
import { z } from 'zod'
import { Role } from '@prisma/client'
export const userRouter = router({
  findAll: authedAdminProcedure
    .input(
      z.object({
        role: z.nativeEnum(Role).optional(),
      }),
    )
    .query(({ input: { role } }) => {
      return prisma.user.findMany({
        orderBy: {
          role: 'asc',
        },
        where: {
          role,
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

  deleteAccount: authedProcedure.mutation(async ({ ctx }) => {
    const { email } = ctx.user

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new Error('No user found')
    }

    await prisma.candidature.deleteMany({
      where: {
        userId: user.id,
      },
    })

    return prisma.user.delete({
      where: {
        email,
      },
    })
  }),
})
