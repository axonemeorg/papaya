import z from "zod"
import { DocumentSchema } from "@/schema/support/document"
import { Mixin } from "../support/mixin"

export const [CreateEntryArtifact, EntryArtifact] = DocumentSchema.new(
    {
        kind: z.literal('zisk:artifact'),
    },
    z.interface({
        originalFileName: z.string(),
        size: z.number(),
        contentType: z.string(),
        description: z.string().optional(),
    }),
    z.interface({
        ...Mixin.derived.timestamps(),
    })
)

export type EntryArtifact = z.output<typeof EntryArtifact>
export type CreateEntryArtifact = z.output<typeof CreateEntryArtifact>
