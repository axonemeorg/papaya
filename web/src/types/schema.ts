import { z } from "zod";

export const Document = z.object({
    _id: z.string(),
    _type: z.string(),
    _rev: z.string().optional(),
    _deleted: z.boolean().optional(),
});

export const EntryType = z.union([z.literal('DEBIT'), z.literal('CREDIT')]);

export const AvatarVariant = z.union([
    z.literal('TEXT'),
    z.literal('PICTORIAL'),
    z.literal('IMAGE'),
]);

export const Avatar = Document.merge(z.object({
    _type: z.literal('AVATAR'),
    content: z.string(),
    variant: AvatarVariant,
    primaryColor: z.string(),
    secondaryColor: z.string(),
}));

export const Category = Document.merge(z.object({
    _type: z.literal('CATEGORY'),
    label: z.string(),
    description: z.string(),
    avatarId: z.string().nullable(),
}));

export const JournalEntry = Document.merge(z.object({
    _type: z.literal('JOURNAL_ENTRY'),
    memo: z.string(),
    notes: z.string(),
    entryType: EntryType,
    date: z.string(),
    parentEntryId: z.string().nullable(),
    paymentMethodId: z.string().nullable(),
    categoryIds: z.array(z.string()),
    attachmentIds: z.array(z.string()),
    tagIds: z.array(z.string()),
    relatedEntryIds: z.array(z.string()),
}));

export type JournalEntry = z.output<typeof JournalEntry>;

export const CreateJournalEntry = z.object({
    parent: JournalEntry,
    children: z.array(JournalEntry),
});

export type CreateJournalEntry = z.output<typeof CreateJournalEntry>;
