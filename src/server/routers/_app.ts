import { publicProcedure, router } from '../trpc'
import { candidatureRouter } from './candidature'
import { reviewRouter } from './reviews'
import { userRouter } from './user'

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  user: userRouter,
  candidature: candidatureRouter,
  review: reviewRouter,
})

export type AppRouter = typeof appRouter
