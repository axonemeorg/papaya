

import { serial, varchar, pgTable, timestamp, pgEnum, integer, primaryKey } from 'drizzle-orm/pg-core'

export const TransactionType = pgEnum("transaction_type", ["DEBIT", "CREDIT"]);
export const PaymentType = pgEnum("transaction_type", ["CASH", "ETRANSFER", "DEBIT", "CREDIT"]);

const timestamps = {
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at'),
}

export const TransactionMethod = pgTable("transaction_method", {
    transactionMethodId: serial('transaction_id').primaryKey(),
    label: varchar('memo', { length: 1023 }),
    defaultPaymentType: PaymentType('default_payment_type').notNull(),
    ...timestamps
});

export const Transaction = pgTable("transaction", {
    transactionId: serial('transaction_id').primaryKey(),
    transactionType: TransactionType('transaction_type').notNull(),
    amount: integer('amount').notNull(),
    memo: varchar('memo', { length: 1023 }),
    transactionMethodId: integer('transaction_method_id').references(() => TransactionMethod.transactionMethodId),
    ...timestamps
});

export const JournalEntry = pgTable("journal_entry", {
    journalEntryId: serial('journal_entry_id').primaryKey(),
    memo: varchar('memo', { length: 1023 }).notNull(),
    ...timestamps
});

export const JournalTransaction = pgTable("journal_transactions", {
    journalEntryId: integer('journal_entry_id')
        .references(() => JournalEntry.journalEntryId)
        .notNull(),
    transactionId: integer('transaction_id')
        .references(() => Transaction.transactionId)
        .notNull(),
}, (_table) => ({
    pk: primaryKey({ columns: [JournalEntry.journalEntryId, Transaction.transactionId]})
}));
