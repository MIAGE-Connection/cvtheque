import { z } from 'zod'
import { authedProcedure, router } from '../../trpc'
import { eventService } from './events.service'
export const eventsRouter = router({
  findByCandidatureId: authedProcedure
    .input(z.object({ candidatureId: z.string() }))
    .query(async ({ input }) => {
      const { candidatureId } = input
      const events = await eventService.getEvents({
        candidatureId,
      })
      return events
    }),
})
