
import { JournalEntryTable, TransactionMethodTable, TransactionTable } from "@/database/schemas"
import { relations, type InferSelectModel } from "drizzle-orm"
import { z } from "zod"
import { AvatarVariant, PaymentType, TransactionType } from "./enum";

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

export const JournalEntry = z.object({
    journalEntryId: z.string(),
    date: z.string(),
    time: z.string(),
    netAmount: z.number(),
    memo: z.string(),
    // methods: z.array(TransactionMethod),
    transactions: z.array(Transaction),
    category: z.optional(Category)
})
export type JournalEntry = z.output<typeof JournalEntry>;
