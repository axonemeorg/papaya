export const CreateAccount = z.object({
    label: z.string(),
    description: z.string(),
    avatar: Avatar,
})

export type CreateAccount = z.output<typeof CreateAccount>

export const Account = DocumentMetadata.merge(BelongsToJournal).merge(CreateCategory).merge(
    z.object({
        kind: z.literal('zisk:account'),
        createdAt: z.string(),
        updatedAt: z.string().nullable().optional(),
    })
)

export type Account = z.output<typeof Account>
