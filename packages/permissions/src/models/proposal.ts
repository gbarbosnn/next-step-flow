import { z } from 'zod'

export const proposalSchema = z.object({
  __typename: z.literal('Proposal').default('Proposal'),
  id: z.string(),
  ownerId: z.string(),
})

export type Proposal = z.infer<typeof proposalSchema>
