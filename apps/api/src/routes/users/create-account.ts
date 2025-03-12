import { roleSchema } from '@repo/permissions'
import { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from 'lib/prisma'
import z from 'zod'

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: roleSchema,
})

export async function createAccount(server: FastifyInstance) {
  server.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Create a new user account by providing a name and email',
        body: bodySchema,
      },
    },
    async (request, reply) => {
      const { name, email, role } = request.body

      const userWithSameEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (userWithSameEmail) {
        return reply
          .status(409)
          .send({ message: 'A user with this email already exists.' })
      }

      await prisma.user.create({
        data: {
          name,
          email,
          role,
        },
      })

      return reply.status(201).send({ message: 'User created' })
    },
  )
}
