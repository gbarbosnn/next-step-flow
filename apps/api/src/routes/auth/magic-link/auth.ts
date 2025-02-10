import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from 'lib/prisma'
import { env } from '@/env'
import dayjs from 'dayjs'

const querySchema = z.object({
  code: z
    .string()
    .describe(
      'Unique code associated with the magic link for user authentication',
    ),
  redirect: z
    .string()
    .url()
    .describe('URL to redirect the user upon successful authentication'),
})

export async function authenticate(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/auth/magic-link',
    {
      schema: {
        tags: ['Auth'],
        summary:
          'Authenticate user with magic link and redirect them to the app',
        querystring: querySchema,
      },
    },
    async (request, reply) => {
      const { code, redirect } = querySchema.parse(request.query)

      if (!redirect.startsWith(env.AUTH_REDIRECT_URL)) {
        throw new Error('Invalid redirect URL')
      }

      const authLink = await prisma.token.findFirst({
        where: {
          id: code,
        },
      })

      if (!authLink) {
        throw new Error('Auth link not found')
      }

      const daysSinceAuthLinkCreation = dayjs().diff(authLink.createdAt, 'day')
      if (daysSinceAuthLinkCreation > 1) {
        await prisma.token.delete({
          where: { userId: authLink.userId, id: code },
        })

        throw new Error('Auth link expired, please generate a new one')
      }

      const user = await prisma.user.findUnique({
        where: { id: authLink.userId },
      })

      if (!user) {
        throw new Error('User not found')
      }

      const token = await reply.jwtSign(
        { sub: user.id },
        { sign: { expiresIn: '7d' } },
      )

      reply.setCookie('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      await prisma.token.delete({
        where: { userId: authLink.userId, id: code },
      })

      return reply.redirect(redirect)
    },
  )
}
