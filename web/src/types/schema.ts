import { z } from "zod";

export const Document = z.object({
    _id: z.string(),
    _rev: z.string().optional(),
    _deleted: z.boolean().optional(),
    type: z.string(),
});

export const EntryType = z.enum([
    'DEBIT',
    'CREDIT',
]);

export const AvatarVariant = z.enum([
    'TEXT',
    'PICTORIAL',
    'IMAGE',
]);

export const Avatar = z.object({
    content: z.string(),
    variant: AvatarVariant,
    primaryColor: z.string(),
    secondaryColor: z.string().optional().nullable(),
});

export type Avatar = z.output<typeof Avatar>;

export const Category = Document.merge(z.object({
    type: z.literal('CATEGORY'),
    label: z.string(),
    description: z.string(),
    avatar: Avatar,
}));

export type Category = z.output<typeof Category>;

export const JournalEntry = Document.merge(z.object({
    type: z.literal('JOURNAL_ENTRY'),
    memo: z.string(),
    amount: z.string().min(0, "A positive number is required"),
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

export const CreateQuickJournalEntry = z.object({
    memo: z.string(),
    categoryIds: z.array(z.string()),
    amount: z.string().min(0, "A positive number is required"),
});

export type CreateQuickJournalEntry = z.output<typeof CreateQuickJournalEntry>;
