import type { FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async (): Promise<string> => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()

        return sub
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Authentication error: ${error.message}`)
        } else {
          throw new Error('Authentication error')
        }
      }
    }
  })
})
