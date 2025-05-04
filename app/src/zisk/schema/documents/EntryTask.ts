import z from "zod"
import { DocumentSchema } from "../support/orm/Document"

export const [CreateEntryTask, EntryTask] = DocumentSchema.new(
    {
        kind: z.literal('zisk:task'),
    },
    z.interface({
        memo: z.string(),
        completedAt: z.string().nullable(),
    }),
    z.interface({})
)

export type CreateEntryTask = z.output<typeof CreateEntryTask>
export type EntryTask = z.output<typeof EntryTask>
