import { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { auth } from '../_middlewares/auth'
import { prisma } from 'lib/prisma'
import { defineAbilityFor, proposalSchema, userSchema } from '@repo/permissions'

const bodySchema = z.object({
  title: z.string().max(70),
  description: z.string(),
})

const paramsSchema = z.object({
  id: z.string().cuid(),
})

export async function updateProposal(server: FastifyInstance) {
  server
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/proposals/:id',
      {
        schema: {
          tags: ['Proposal'],
          security: [{ bearerAuth: [] }],
          summary: '',
          body: bodySchema,
          params: paramsSchema,
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { title, description } = request.body
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

        const inReview = await prisma.proposal.findFirst({
          where: {
            id,
            userId,
            status: 'REVIEW',
          },
        })

        if (!inReview) {
          return reply.status(400).send({
            message:
              'You cannot update proposals that have already been reviewed',
          })
        }

        const userParsed = userSchema.parse(user)
        const proposalParsed = proposalSchema.parse(inReview)

        const permisssion = defineAbilityFor(userParsed)
        const userCanUpdateProposal = permisssion.can('update', proposalParsed)

        if (!userCanUpdateProposal) {
          return reply.status(401).send({
            message: 'Unauthorized',
          })
        }

        await prisma.proposal.update({
          data: {
            title,
            description,
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
