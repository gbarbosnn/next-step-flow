import { cookies } from 'next/headers'
import { api } from './api'

interface CreateProposalRequest {
  title: string
  description: string
}

export async function createProposal({
  title,
  description,
}: CreateProposalRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  const result = await api.post('proposals', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    json: { title, description },
  })

  return result
}
