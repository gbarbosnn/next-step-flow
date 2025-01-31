import { z } from 'zod'
import { proposalSchema } from '../models/proposal'

export const proposalSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('approve'),
    z.literal('change_status'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('Proposal'), proposalSchema]),
])

export type ProposalSubject = z.infer<typeof proposalSubject>
