
import { JournalEntryTable, TransactionMethodTable, TransactionTable } from "@/database/schemas"
import { relations, type InferSelectModel } from "drizzle-orm"
import { z } from "zod"
import { AvatarVariant, PaymentType } from "./enum";

export const Timestamps = z.object({
    createdAt: z.union([z.string(), z.date()]),
    updatedAt: z.string().nullable(),
});
export type Timestamps = z.infer<typeof Timestamps>;

export const ItemAvatar = z.object({
    avatarContent: z.string(),
    avatarVariant: AvatarVariant,
    avatarPrimaryColor: z.string(),
    avatarSecondaryColor: z.string(),
});
export type ItemAvatar = z.infer<typeof ItemAvatar>;

export const TransactionMethod = Timestamps
    .merge(ItemAvatar)
    .extend({
        transactionMethodId: z.string().uuid(),
        label: z.string(),
        defaultPaymentType: PaymentType,
    });
export type TransactionMethod = z.infer<typeof TransactionMethod>;

export const Category = Timestamps
    .merge(ItemAvatar)
    .extend({
        categoryId: z.string().uuid(),
        icon: z.string(),
        color: z.string(),
        description: z.string(),
        label: z.string(),
    });
export type Category = z.infer<typeof Category>;

