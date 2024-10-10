
import { JournalEntryTable, TransactionMethodTable, TransactionTable } from "@/database/schemas"
import { relations, type InferSelectModel } from "drizzle-orm"
import { z } from "zod"
import { AvatarVariant, PaymentType, TransactionTag, TransactionType } from "./enum";

export const Timestamps = z.object({
    createdAt: z.union([z.string(), z.date()])
        .optional(),
    updatedAt: z.string().nullable()
        .optional(),
});
export type Timestamps = z.output<typeof Timestamps>;

export const ItemAvatar = z.object({
    avatarContent: z.string(),
    avatarVariant: AvatarVariant,
    avatarPrimaryColor: z.string(),
    avatarSecondaryColor: z.string()
        .optional()
        .nullable(),
});
export type ItemAvatar = z.output<typeof ItemAvatar>;

export const TransactionMethod = Timestamps
    .merge(ItemAvatar)
    .extend({
        transactionMethodId: z.string().uuid(),
        label: z.string(),
        defaultPaymentType: PaymentType,
    });
export type TransactionMethod = z.output<typeof TransactionMethod>;

export const Transaction = z.object({
    transactionId: z.string(),
    amount: z.number(),
    transactionType: TransactionType,
    memo: z.string().optional().nullable(),
    method: TransactionMethod.optional(),
    tags: z.array(
        z.object({ tag: TransactionTag })
    ),
});
export type Transaction = z.output<typeof Transaction>;

export const Category = Timestamps
    .merge(ItemAvatar)
    .extend({
        categoryId: z.string().uuid(),
        label: z.string(),
        description: z.string(),
    });
export type Category = z.output<typeof Category>;

export const UserFileUpload = z.object({
    userFileUploadId: z.string(),
    mimeType: z.string(),
    s3Key: z.string(),
});

export type UserFileUpload = z.output<typeof UserFileUpload>;

export const JournalEntryAttachment = z.object({
    journalEntryAttachmentId: z.string(),
    memo: z.string()
        .nullable(),
    fileUpload: UserFileUpload,
});
export type JournalEntryAttachment = z.output<typeof JournalEntryAttachment>;

export const JournalEntry = z.object({
    journalEntryId: z.string(),
    entryNumber: z.number(),
    date: z.string(),
    time: z.string(),
    netAmount: z.number(),
    memo: z.string(),
    transactions: z.array(Transaction),
    category: z.optional(Category),
    attachments: z.array(JournalEntryAttachment),
})
export type JournalEntry = z.output<typeof JournalEntry>;
