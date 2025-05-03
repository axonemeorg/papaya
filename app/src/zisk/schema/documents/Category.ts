import z from "zod"
import { DocumentSchema } from "@/schema/support/document"
import { Avatar } from '@/schema/models/Avatar'
import { Mixin } from "@/schema/support/mixin"

export const [CreateCategory, Category] = DocumentSchema.new(
    { 
        kind: z.literal('zisk:category'),
    },
    z.interface({
        label: z.string(),
        description: z.string(),
        avatar: Avatar,
    })
        .extend(Mixin.intrinsic.belongsToJournal()),
    Mixin.derived.timestamps(),
)

export type CreateCategory = z.output<typeof CreateCategory>
export type Category = z.output<typeof Category>
