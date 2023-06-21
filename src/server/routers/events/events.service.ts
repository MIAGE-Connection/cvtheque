import { Event } from '@prisma/client'
import { prisma } from 'server/prisma'

type AddEvent = {
  candidatureId: string
  email: string
  event: Event
}

export const eventService = {
  async getEvents() {
    return prisma.events.findMany()
  },
  async addEvent({ candidatureId, event, email }: AddEvent) {
    if (event === 'VIEW') {
      // Prevent spamming events
      const previousEvent = await prisma.events.findFirst({
        where: {
          createdAt: {
            gt: new Date(new Date().getTime() - 10 * 60 * 1000),
            lt: new Date(new Date().getTime() + 10 * 60 * 1000),
          },
        },
      })

      if (previousEvent) {
        return
      }
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new Error(`Cannot add event for user ${email}`)
    }

    return prisma.events.create({
      data: {
        candidatureId,
        event,
        userId: user.id,
      },
    })
  },
}
