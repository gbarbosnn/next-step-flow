import { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { auth } from '../_middlewares/auth'
import { prisma } from 'lib/prisma'
import { defineAbilityFor, proposalSchema, userSchema } from '@repo/permissions'

const paramsSchema = z.object({
  id: z.string().cuid(),
})

export async function deleteProposal(server: FastifyInstance) {
  server
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
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

        const proposal = await prisma.proposal.findFirst({
          where: {
            id,
            userId,
          },
        })

        if (!proposal) {
          return reply.status(404).send({
            message: 'Proposal not found!',
          })
        }

        if (proposal.status !== 'REVIEW') {
          return reply.status(400).send({
            message:
              'You cannot update proposals that have already been reviewed',
          })
        }

        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)

        if (proposal.createdAt < tenMinutesAgo) {
          return reply.status(400).send({
            message:
              'You cannot update proposals that were created more than 10 minutes ago',
          })
        }

        const userParsed = userSchema.parse(user)
        const proposalParsed = proposalSchema.parse(proposal)

        const permisssion = defineAbilityFor(userParsed)
        const userCanDeleteProposal = permisssion.can('update', proposalParsed)

        if (!userCanDeleteProposal) {
          return reply.status(403).send({
            message: 'You do not have permission to delete this proposal',
          })
        }

        await prisma.proposal.update({
          data: {
            hidden: true,
          },
          where: {
            id,
            userId,
          },
        })

        return reply.status(200).send()
      },
    )
}
