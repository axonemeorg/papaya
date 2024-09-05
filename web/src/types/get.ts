
import { JournalEntryTable, TransactionMethodTable, TransactionTable } from "@/database/schemas"
import { relations, type InferSelectModel } from "drizzle-orm"
import { z } from "zod"
import { PaymentType } from "./enum";

// export type TransactionMethod = InferSelectModel<typeof TransactionMethodTable>

const Timestamps = z.object({
    createdAt: z.union([z.string(), z.date()]),
    updatedAt: z.string().nullable(),
});
export type Timestamps = z.infer<typeof Timestamps>;

export const TransactionMethod = Timestamps.extend({
    transactionMethodId: z.string().uuid(),
    // userId: z.string(), // TODO ideally we should not fetch this.
    label: z.string(),
    defaultPaymentType: PaymentType
});
export type TransactionMethod = z.infer<typeof TransactionMethod>;

export const Category = Timestamps.extend({
    categoryId: z.string().uuid(),
    icon: z.string(),
    color: z.string(),
    description: z.string(),
    // userId: z.string(), // TODO ideally we should not fetch this.
    label: z.string(),
});
export type Category = z.infer<typeof Category>;


// Table models (deprecated)

export type Transaction = InferSelectModel<typeof TransactionTable> & {
    transactionMethod: TransactionMethod
}

export type JournalEntry = InferSelectModel<typeof JournalEntryTable> & {
    transactions: Transaction[]
    category: Category
}
