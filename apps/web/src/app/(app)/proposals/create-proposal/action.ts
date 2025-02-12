'use server'

import { createProposal } from '@/http/create-proposal'
import { proposalSchema } from '@repo/permissions'
import { HTTPError } from 'ky'
import { z } from 'zod'

const oganizationSchema = z.object({
  title: z
    .string()
    .min(10, { message: 'O título deve ter no mínimo 10 caracteres.' })
    .max(70, { message: 'O título deve ter no máximo 70 caracteres.' }),
  description: z
    .string()
    .min(30, { message: 'A descrição deve ter no mínimo 30 caracteres.' }),
})

export type ProposalSchema = z.infer<typeof proposalSchema>

export async function createProposalAction(data: FormData) {
  const result = oganizationSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    console.log(errors)
    return { success: false, message: null, errors }
  }

  const { title, description } = result.data

  try {
    await createProposal({ title, description })

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
