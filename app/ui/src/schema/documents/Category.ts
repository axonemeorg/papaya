import { Avatar } from '@ui/schema/models/Avatar'
import { Document } from '@ui/schema/support/orm/Document'
import { Mixin } from '@ui/schema/support/orm/Mixin'
import { z } from 'zod/v4'

export const [CreateCategory, Category] = Document.fromSchemas([
  {
    kind: z.literal('zisk:category'),
    label: z.string(),
    description: z.string(),
    avatar: Avatar,
  },
  {
    ...Mixin.derived.timestamps(),
    ...Mixin.derived.belongsToJournal(),
  },
])

export type CreateCategory = z.output<typeof CreateCategory>
export type Category = z.output<typeof Category>
