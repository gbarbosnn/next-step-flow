'use server'

import { signInWithMagicLink } from '@/http/sign-in-with-magic-link'
import { HTTPError } from 'ky'
import { z } from 'zod'

const signInSchema = z.object({
  email: z.string().email(),
})

export async function signIn(data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { email } = result.data

  try {
    await signInWithMagicLink({ email: String(email) })

    return { success: true, message: null, errors: null }
  } catch (error) {
    console.error(error)

    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return { success: false, message, errors: null }
    }

    return {
      success: false,
      message: 'Tente novamente em alguns minutos...',
      errors: null,
    }
  }
}
