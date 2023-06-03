import { publicProcedure, router } from '../trpc'
import { candidatureRouter } from './candidature'
import { userRouter } from './user'

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  user: userRouter,
  candidature: candidatureRouter,
})

export type AppRouter = typeof appRouter
