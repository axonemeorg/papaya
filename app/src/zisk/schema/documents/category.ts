import z from "zod"
import { DocumentSchema } from "@/schema/support/document"
import { Avatar } from '@/schema/models/avatar'
import { Mixin } from "@/schema/support/mixin"

export const [CreateCategory, Category] = DocumentSchema.new(
    { kind: z.literal('zisk:category') },
    {
        label: z.string(),
        description: z.string(),
        avatar: Avatar,
        ...Mixin.intrinsic.belongsToJournal(),
    },
    {
        createdAt: z.string(),
        updatedAt: z.string().nullable().optional(),
    }
)

export type CreateCategory = z.output<typeof CreateCategory>
export type Category = z.output<typeof Category>
