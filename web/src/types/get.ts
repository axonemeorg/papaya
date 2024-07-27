
import { JournalEntryTable, TransactionMethodTable, TransactionTable } from "@/database/schemas"
import { relations, type InferSelectModel } from "drizzle-orm"

export type TransactionMethod = InferSelectModel<typeof TransactionMethodTable>

export type Transaction = InferSelectModel<typeof TransactionTable> & {
    transactionMethod: TransactionMethod
}

export type JournalEntry = InferSelectModel<typeof JournalEntryTable> & {
    transactions: Transaction[]
}
