import z from "zod"
import { DocumentSchema } from "../support/document"
import { Mixin } from "../support/mixin"

export const [CreateEntryTag, EntryTag] = DocumentSchema.new(
    { 
        kind: z.literal('zisk:tag'),
    },
    z.interface({
        label: z.string(),
        description: z.string(),
        ...Mixin.intrinsic.belongsToJournal(),
    }),
    z.interface({
        ...Mixin.derived.timestamps(),
    })
)

export type CreateEntryTag = z.output<typeof CreateEntryTag>
export type EntryTag = z.output<typeof EntryTag>
