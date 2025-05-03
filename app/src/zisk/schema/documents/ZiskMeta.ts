
export const ZiskMeta = IdentifierMetadata.merge(
	z.object({
		kind: z.literal('ZISK_META'),
		activeJournalId: z.string().nullable(),
		settings: ZiskSettings,
		createdAt: z.string(),
	})
)

export type ZiskMeta = z.output<typeof ZiskMeta>

