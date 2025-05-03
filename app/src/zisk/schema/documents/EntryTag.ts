export const CreateEntryTag = z.object({
    label: z.string(),
    description: z.string(),
})

export type CreateEntryTag = z.output<typeof CreateEntryTag>



export const EntryTag = DocumentMetadata.merge(BelongsToJournal).merge(CreateEntryTag).merge(
    z.object({
        kind: z.literal('zisk:tag'),
        createdAt: z.string(),
        updatedAt: z.string().nullable(),
    })
)

export type EntryTag = z.output<typeof EntryTag>

