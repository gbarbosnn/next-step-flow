import { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { auth } from '../_middlewares/auth'
import { prisma } from 'lib/prisma'
import { defineAbilityFor, proposalSchema, userSchema } from '@repo/permissions'

const paramsSchema = z.object({
  page: z.number(),
})

export async function getAllProposals(server: FastifyInstance) {
  server
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/proposals',
      {
        schema: {
          tags: ['Proposal'],
          security: [{ bearerAuth: [] }],
          summary: '',
          params: paramsSchema,
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { page } = request.params

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })

        if (!user) {
          return reply.status(404).send({
            message: 'User not found',
          })
        }

        const userParsed = userSchema.parse(user)

        const permisssion = defineAbilityFor(userParsed)
        const userCanGetProposals = permisssion.can('get', 'Proposal')

        if (!userCanGetProposals) {
          return reply.status(401).send({
            message: 'Unauthorized',
          })
        }

        const isAdmin = user.role === 'ADMIN'
        const searchCondition = isAdmin ? { userId } : {}

        const proposals = await prisma.proposal.findMany({
          skip: page,
          take: 10,
          where: searchCondition,
        })

        return reply.status(200).send({ proposals: proposals })
      },
    )
}
