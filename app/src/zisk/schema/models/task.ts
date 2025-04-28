import z from "zod"
import { ModelSchema } from "@/schema/support/model"
import { Mixin } from "@/schema/support/mixin"

export const EntryTask = ModelSchema.from(
    {
        kind: z.literal('zisk:task')
    },
    z.interface({
        description: z.string(),
        completedAt: z.string().nullable(),
        ...Mixin.intrinsic.belongsToJournal(),
    })
)

export type EntryTask = z.output<typeof EntryTask>
