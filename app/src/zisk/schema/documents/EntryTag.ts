import z from "zod"
import { DocumentSchema } from "../support/orm/Document"
import { Mixin } from "../support/orm/Mixin"

export const [CreateEntryTag, EntryTag] = DocumentSchema.new(
    { 
        kind: z.literal('zisk:tag'),
    },
    z.interface({
        label: z.string(),
        description: z.string(),
    }),
    Mixin.derived.timestamps()
        .extend(Mixin.derived.belongsToJournal())
)

export type CreateEntryTag = z.output<typeof CreateEntryTag>
export type EntryTag = z.output<typeof EntryTag>
