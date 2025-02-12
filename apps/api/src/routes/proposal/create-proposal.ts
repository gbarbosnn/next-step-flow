import { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { auth } from '../_middlewares/auth'
import { prisma } from 'lib/prisma'

const bodySchema = z.object({
  title: z.string().max(70),
  description: z.string(),
})

export async function createProposal(server: FastifyInstance) {
  server
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/proposals',
      {
        schema: {
          tags: ['Proposal'],
          security: [{ bearerAuth: [] }],
          summary: '',
          body: bodySchema,
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { title, description } = request.body

        await prisma.proposal.create({
          data: {
            title,
            description,
            status: 'REVIEW',
            userId,
          },
        })

        return reply.status(201).send()
      },
    )
}
