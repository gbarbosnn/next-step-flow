import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '../_middlewares/auth'
import { prisma } from 'lib/prisma'

const responseSchema = z.object({
  user: z
    .object({
      id: z.string().describe('Unique identifier for the user'),
      name: z.string().describe('Name of the user'),
      email: z.string().email().describe('Email of the user'),
    })
    .describe('Authenticated user information'),
})

export async function getProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/profile',
      {
        schema: {
          tags: ['Auth', 'User'],
          summary: 'Retrieve authenticated user profile',
          security: [{ bearerAuth: [] }],
          response: {
            200: responseSchema,
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const user = await prisma.user.findUnique({
          select: {
            id: true,
            name: true,
            email: true,
          },
          where: {
            id: userId,
          },
        })

        if (!user) {
          throw new Error('User not found')
        }

        return reply.status(200).send({ user })
      },
    )
}
