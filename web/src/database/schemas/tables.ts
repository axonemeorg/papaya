import {
    serial,
    varchar,
    pgTable,
    timestamp,
    integer,
    text,
} from 'drizzle-orm/pg-core'

import { PaymentType, TransactionType } from './enums';
import { UserTable } from './auth';

const timestamps = {
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at'),
}

export const TransactionMethodTable = pgTable("transaction_method", {
    transactionMethodId: serial('transaction_method_id').primaryKey(),
    userId: text('user_id').references(() => UserTable.id),
    label: varchar('label', { length: 128 }),
    defaultPaymentType: PaymentType('default_payment_type').notNull(),
    ...timestamps
});

export const TransactionTable = pgTable("transaction", {
    transactionId: serial('transaction_id').primaryKey(),
    journalEntryId: integer('journal_entry_id').references(() => JournalEntryTable.journalEntryId),
    transactionType: TransactionType('transaction_type').notNull(),
    amount: integer('amount').notNull(),
    memo: varchar('memo', { length: 1024 }),
    transactionMethodId: integer('transaction_method_id').references(() => TransactionMethodTable.transactionMethodId),
    ...timestamps
});

export const JournalEntryTable = pgTable("journal_entry", {
    journalEntryId: serial('journal_entry_id').primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => UserTable.id),
    memo: varchar('memo', { length: 1024 }).notNull(),
    ...timestamps
});
