import { Avatar } from '@ui/schema/models/Avatar'
import { Document } from '@ui/schema/support/orm/Document'
import { Mixin } from '@ui/schema/support/orm/Mixin'
import { z } from 'zod/v4'

export const [CreateJournal, Journal] = Document.fromSchemas([
  {
    kind: z.literal('zisk:journal'),
    journalName: z.string(),
    description: z.string().optional(),
    avatar: Avatar,
  },
  {
    ...Mixin.derived.timestamps(),
  },
])

export type CreateJournal = z.output<typeof CreateJournal>
export type Journal = z.output<typeof Journal>
