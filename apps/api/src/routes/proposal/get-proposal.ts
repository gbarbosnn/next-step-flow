import { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { auth } from '../_middlewares/auth'
import { prisma } from 'lib/prisma'
import { defineAbilityFor, proposalSchema, userSchema } from '@repo/permissions'

const paramsSchema = z.object({
  id: z.string().cuid(),
})

export async function getProposal(server: FastifyInstance) {
  server
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/proposals/:id',
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
        const { id } = request.params

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

        const proposal = await prisma.proposal.findUnique({
          where: {
            id,
            userId,
          },
        })

        const userParsed = userSchema.parse(user)
        const proposalParsed = proposalSchema.parse(proposal)

        const permisssion = defineAbilityFor(userParsed)
        const userCanGetProposals = permisssion.can('get', proposalParsed)

        if (!userCanGetProposals) {
          return reply.status(401).send({
            message: 'Unauthorized',
          })
        }

        return reply.status(200).send({ proposal: proposal })
      },
    )
}
