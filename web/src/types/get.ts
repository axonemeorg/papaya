
import { JournalEntryTable, TransactionMethodTable, TransactionTable } from "@/database/schemas"
import { relations, type InferSelectModel } from "drizzle-orm"
import { z } from "zod"
import { PaymentType } from "./enum";

// export type TransactionMethod = InferSelectModel<typeof TransactionMethodTable>

const Timestamps = z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
});
export type Timestamps = z.infer<typeof Timestamps>;

export const TransactionMethod = Timestamps.extend({
    transactionMethodId: z.number(),
    userId: z.string(),
    label: z.string(),
    defaultPaymentType: PaymentType
});
export type TransactionMethod = z.infer<typeof TransactionMethod>;





// Table models (deprecated)

export type Transaction = InferSelectModel<typeof TransactionTable> & {
    transactionMethod: TransactionMethod
}

export type JournalEntry = InferSelectModel<typeof JournalEntryTable> & {
    transactions: Transaction[]
}
