import z from "zod"
import { DocumentSchema } from "@/schema/support/document"
import { Avatar } from '@/schema/models/avatar'
import { Mixin } from "@/schema/support/mixin"

export const [CreateCategory, Category] = DocumentSchema.new(
    { 
        kind: z.literal('zisk:category'),
        // Optional: can specify custom version, derived, or ephemeral schemas
        // version: z.union([z.string(), z.number()]).optional(),
        // derived: z.object({ customDerived: z.string() }).optional(),
        // ephemeral: z.object({ customEphemeral: z.boolean() }).optional()
    },
    z.interface({
        label: z.string(),
        description: z.string(),
        avatar: Avatar,
        ...Mixin.intrinsic.belongsToJournal(),
    }),
    z.interface({
        ...Mixin.derived.timestamps(),
    })
)

export type CreateCategory = z.output<typeof CreateCategory>
export type Category = z.output<typeof Category>
