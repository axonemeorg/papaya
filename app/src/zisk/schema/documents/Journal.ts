
export const CreateJournalMeta = z.object({
	journalName: z.string().min(1, 'Journal name must be at least 1 character'),
	avatar: Avatar,
})

export type CreateJournalMeta = z.output<typeof CreateJournalMeta>


export const Journal = IdentifierMetadata.merge(CreateJournalMeta).merge(
	z.object({
		kind: z.literal('zisk:journal'),
		journalVersion: z.nativeEnum(JournalVersion),
		createdAt: z.string(),
		updatedAt: z.string().nullable(),
	})
)
