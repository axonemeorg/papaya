import z from "zod"
import { DocumentSchema } from "../support/orm/Document"

export const [CreateEntryTask, EntryTask] = DocumentSchema.new(
    {
        kind: z.literal('zisk:task'),
    },
    z.interface({
        description: z.string(),
        completedAt: z.string().nullable(),
    }),
    null
)

export type CreateEntryTask = z.output<typeof CreateEntryTask>
export type EntryTask = z.output<typeof EntryTask>
