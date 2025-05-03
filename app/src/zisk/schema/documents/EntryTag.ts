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
    })
        .extend(Mixin.intrinsic.belongsToJournal()),
    Mixin.derived.timestamps(),
)

export type CreateEntryTag = z.output<typeof CreateEntryTag>
export type EntryTag = z.output<typeof EntryTag>
