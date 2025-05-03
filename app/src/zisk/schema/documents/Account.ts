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
    })
        .extend(Mixin.intrinsic.belongsToJournal()),
    Mixin.derived.timestamps(),
)

export type CreateAccount = z.output<typeof CreateAccount>
export type Account = z.output<typeof Account>
