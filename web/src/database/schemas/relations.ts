import { relations } from "drizzle-orm";
import { JournalEntryTable, TransactionTable } from "./tables";

export const JournalEntryTableRelations = relations(JournalEntryTable, ({ one, many }) => {
    return {
        transactions: many(TransactionTable)
    }
});

export const TransactionTableRelations = relations(TransactionTable, ({ one, many }) => {
    return {
        journalEntry: one(JournalEntryTable, {
            fields: [TransactionTable.journalEntryId],
            references: [JournalEntryTable.journalEntryId]
        })
    }
});
