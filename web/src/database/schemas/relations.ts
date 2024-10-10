import { relations } from "drizzle-orm";
import { CategoryTable, JournalEntryTable, TransactionMethodTable, TransactionTable, TransactionTagTable } from "./tables";

export const JournalEntryTableRelations = relations(JournalEntryTable, ({ one, many }) => {
    return {
        transactions: many(TransactionTable),
        category: one(CategoryTable, {
            fields: [JournalEntryTable.categoryId],
            references: [CategoryTable.categoryId]
        }),
    }
});

export const TransactionTableRelations = relations(TransactionTable, ({ one, many }) => {
    return {
        tags: many(TransactionTagTable),
        journalEntry: one(JournalEntryTable, {
            fields: [TransactionTable.journalEntryId],
            references: [JournalEntryTable.journalEntryId]
        }),
        method: one(TransactionMethodTable, {
            fields: [TransactionTable.transactionMethodId],
            references: [TransactionMethodTable.transactionMethodId]
        }),
        category: one(CategoryTable, {
            fields: [TransactionTable.categoryId],
            references: [CategoryTable.categoryId]
        }),
    }
});

export const TransactionTagTableRelations = relations(TransactionTagTable, ({ one, many }) => {
    return {
        transaction: one(TransactionTable, {
            fields: [TransactionTagTable.transactionId],
            references: [TransactionTable.transactionId]
        }),
    }
});
