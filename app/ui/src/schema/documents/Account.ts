import { Avatar } from '@ui/schema/models/Avatar'
import { Document } from '@ui/schema/support/orm/Document'
import { Mixin } from '@ui/schema/support/orm/Mixin'
import z from 'zod'

export const [CreateAccount, Account] = Document.fromSchemas([
  {
    kind: z.literal('zisk:account'),

    label: z.string(),
    description: z.string(),
    avatar: Avatar,
  },
  {
    ...Mixin.derived.timestamps(),
    ...Mixin.derived.belongsToJournal(),
  },
])

export type CreateAccount = z.output<typeof CreateAccount>
export type Account = z.output<typeof Account>
