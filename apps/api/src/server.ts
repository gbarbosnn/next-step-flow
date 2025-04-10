import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fCookies from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { env } from './env'
import { createAccount } from './routes/users/create-account'
import { sendLink } from './routes/auth/magic-link/send-link'
import { authenticate } from './routes/auth/magic-link/auth'
import { getProfile } from './routes/users/get-profile'
import { createProposal } from './routes/proposal/create-proposal'
import { updateProposal } from './routes/proposal/update-proposal'
import { deleteProposal } from './routes/proposal/delete-proposal'
import { getAllProposals } from './routes/proposal/get-all-proposals'
import { getProposal } from './routes/proposal/get-proposal'

const server = fastify().withTypeProvider<ZodTypeProvider>()

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

server.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
})

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'SampleApi',
      description: 'Sample backend service',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },

    servers: [],
  },
  transform: jsonSchemaTransform,
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

server.register(fCookies)
server.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

//# routes

//## auth
server.register(createAccount)
server.register(getProfile)

//### magic Link
server.register(sendLink)
server.register(authenticate)

//## proposal
server.register(createProposal)
server.register(updateProposal)
server.register(deleteProposal)
server.register(getProposal)
server.register(getAllProposals)

const start = async () => {
  try {
    await server.listen({
      port: env.PORT | 3333,
      host: '::',
    })

    console.log('HTTP SERVER RUNNING🔥')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
