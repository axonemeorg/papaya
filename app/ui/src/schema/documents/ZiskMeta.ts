import { z } from 'zod/v4'
import { UserSettings } from '../models/UserSettings'
import { Document } from '../support/orm/Document'
import { Mixin } from '../support/orm/Mixin'

export const [CreateZiskMeta, ZiskMeta] = Document.fromSchemas([
  {
    kind: z.literal('zisk:meta'),
    activeJournalId: z.string().nullable(),
    userSettings: UserSettings,
  },
  {
    ...Mixin.derived.timestamps(),
  },
])
export type CreateZiskMeta = z.output<typeof CreateZiskMeta>
export type ZiskMeta = z.output<typeof ZiskMeta>
