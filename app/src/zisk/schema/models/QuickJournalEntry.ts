
export const CreateQuickJournalEntry = z.object({
    amount: z.string(),
	memo: z.string().optional(),
	categoryId: z.string().optional(),
}))

export type CreateQuickJournalEntry = z.output<typeof CreateQuickJournalEntry>

