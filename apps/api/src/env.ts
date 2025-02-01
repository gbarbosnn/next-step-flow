import { z } from 'zod'
import 'dotenv/config'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number(),
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
