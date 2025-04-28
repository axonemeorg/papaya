import z from "zod"
import { DocumentSchema } from "@/schema/support/document"

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
        createdAt: z.string(),
        updatedAt: z.string().nullable().optional(),
    })
)

export type EntryArtifact = z.output<typeof EntryArtifact>
export type CreateEntryArtifact = z.output<typeof CreateEntryArtifact>
