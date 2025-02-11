import { api } from './api'

interface SignInWithMagicLinkRequest {
  email: string
}

export async function signInWithMagicLink({
  email,
}: SignInWithMagicLinkRequest) {
  const result = await api
    .post('auth/magic-link/send-link', {
      json: {
        email,
      },
    })
    .json()

  return result
}
