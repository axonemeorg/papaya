export const ReservedTagKey = z.enum([
    'FLAGGED',
    'NEEDS_REVIEW',
    'WAS_REVIEWED',
    'APPROXIMATE',
    'PENDING',
])

export type ReservedTagKey = z.output<typeof ReservedTagKey>

export const ReservedTag = CreateEntryTag.merge(z.object({
    _id: ReservedTagKey,
    kind: z.literal('RESERVED_TAG'),
    /**
     * The Reserved Tag is not selectable within the app.
     */
    disabled: z.boolean().optional(),
    /**
     * The Reserved Tag is no longer used.
     */
    archived: z.boolean().optional(),
}))

export type ReservedTag = z.output<typeof ReservedTag>

