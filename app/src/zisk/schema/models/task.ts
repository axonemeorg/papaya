import z from "zod"
import { ModelSchema } from "@/schema/support/model"
import { Mixin } from "@/schema/support/mixin"

export const EntryTask = ModelSchema.from(
    {
        kind: z.literal('zisk:task'),
        // Optional: can specify custom version, derived, or ephemeral schemas
        // version: z.union([z.string(), z.number()]).optional(),
        // derived: z.object({ customDerived: z.string() }).optional(),
        // ephemeral: z.object({ customEphemeral: z.boolean() }).optional()
    },
    z.interface({
        description: z.string(),
        completedAt: z.string().nullable(),
        ...Mixin.intrinsic.belongsToJournal(),
    })
)

export type EntryTask = z.output<typeof EntryTask>
