/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { prisma } from 'server/prisma'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const candidatureRouter = router({
  add: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        city: z.string(),
        info: z.string().nullish(),
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
      }),
    )
    .mutation(async ({ input }) => {
      const { firstName, lastName, city, experiences, schools, info } = input
      console.log('#### ~ schools:', schools)
      console.log('#### ~ experiences:', experiences)
      const candidature = await prisma.candidature.create({
        data: {
          firstName,
          lastName,
          city,
          info,
          remote: false,
          schools: { createMany: { data: schools } },
          experiences: { createMany: { data: experiences } },
        },
      })
      return candidature
    }),
})
