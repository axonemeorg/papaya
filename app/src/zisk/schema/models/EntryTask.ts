import z from "zod"
import { ModelSchema } from "@/schema/support/orm/Model"
import { Mixin } from "@/schema/support/orm/Mixin"

export const EntryTask = ModelSchema.from(
    {
        kind: z.literal('zisk:task'),
    },
    z.interface({
        description: z.string(),
        completedAt: z.string().nullable(),
    })
)

export type EntryTask = z.output<typeof EntryTask>
