import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from 'lib/prisma'
import { env } from '@/env'
import { sendMail } from 'lib/mail/microsoft-exchange/auth/authenticate'

const bodySchema = z.object({
  email: z
    .string()
    .email()
    .describe('Email address of the user attempting to authenticate'),
})

export async function sendLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/auth/magic-link/send-link',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Send a magic link to the user for authentication',
        body: bodySchema,
      },
    },
    async (request, reply) => {
      const { email } = request.body

      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      })

      if (!user) {
        return reply.status(200).send()
      }

      const token = await prisma.token.create({
        data: {
          type: 'ACCESS',
          userId: user.id,
        },
      })

      const authLinkCode = token.id

      const authLink = new URL('/auth/magic-link', env.API_BASE_URL)

      authLink.searchParams.set('code', authLinkCode)
      authLink.searchParams.set('redirect', env.AUTH_REDIRECT_URL)

      await sendMail(email, 'Authenticate', user.name, authLink.toString())

      return reply.status(200).send()
    },
  )
}
