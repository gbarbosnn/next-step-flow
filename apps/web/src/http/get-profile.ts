import { cookies } from 'next/headers'
import { api } from './api'

interface GetProfileResponse {
  user: {
    id: string
    name: string
    email: string
  }
}

export async function getProfile() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  const result = await api
    .get('profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json<GetProfileResponse>()

  return result
}
