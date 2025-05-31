import { Document } from '@ui/schema/support/orm/Document'
import { z } from 'zod/v4'
import { Mixin } from '../support/orm/Mixin'

export const [CreateEntryArtifact, EntryArtifact] = Document.fromSchemas([
  {
    kind: z.literal('zisk:artifact'),
    originalFileName: z.string(),
    size: z.number(),
    contentType: z.string(),
    description: z.string().optional(),
  },
  {
    ...Mixin.derived.timestamps(),
    ...Mixin.derived.belongsToJournal(),
  },
])

export type EntryArtifact = z.output<typeof EntryArtifact>
export type CreateEntryArtifact = z.output<typeof CreateEntryArtifact>
