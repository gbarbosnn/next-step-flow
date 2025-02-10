import { z } from 'zod'
import 'dotenv/config'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number(),

  JWT_SECRET: z.string(),

  API_BASE_URL: z.string().url(),
  AUTH_REDIRECT_URL: z.string().url(),

  EXCHANGE_EMAIL: z.string().email(),
  EXCHANGE_PASSWORD: z.string(),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error(
    'Invalid enviroment variables',
    parsedEnv.error.flatten().fieldErrors,
  )

  throw new Error('Invalid environment variables')
}

export const env = parsedEnv.data
