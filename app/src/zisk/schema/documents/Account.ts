import z from "zod"
import { DocumentSchema } from "@/schema/support/orm/Document"
import { Avatar } from '@/schema/models/Avatar'
import { Mixin } from "@/schema/support/orm/Mixin"

export const [CreateAccount, Account] = DocumentSchema.new(
    { 
        kind: z.literal('zisk:account'),
    },
    z.interface({
        label: z.string(),
        description: z.string(),
        avatar: Avatar,
    }),
    Mixin.derived.timestamps()
        .extend(Mixin.derived.belongsToJournal())
)

export type CreateAccount = z.output<typeof CreateAccount>
export type Account = z.output<typeof Account>
