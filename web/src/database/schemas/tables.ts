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
    userId: text('user_id').references(() => UserTable.id).notNull(),
    label: varchar('label', { length: 128 }).notNull(),
    defaultPaymentType: PaymentType('default_payment_type').notNull(),

    ...timestamps
});

export const TransactionTable = pgTable("transaction", {
    transactionId: serial('transaction_id').primaryKey(),
    journalEntryId: integer('journal_entry_id').references(() => JournalEntryTable.journalEntryId).notNull(),
    transactionType: TransactionType('transaction_type').notNull(),
    paymentType: PaymentType('payment_type').notNull(),
    amount: integer('amount').notNull(),
    memo: varchar('memo', { length: 1024 }),
    transactionMethodId: integer('transaction_method_id').references(() => TransactionMethodTable.transactionMethodId).notNull(),

    ...timestamps
});

export const CategoryTable = pgTable("category", {
    categoryId: serial('category_id').primaryKey(),
    label: varchar('label', { length: 128 })
        .notNull(),
    userId: text('user_id')
        .references(() => UserTable.id)
        .notNull(),

    ...timestamps,
})

export const JournalEntryTable = pgTable("journal_entry", {
    journalEntryId: serial('journal_entry_id').primaryKey(),
    memo: varchar('memo', { length: 1024 }).notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => UserTable.id),
    categoryId: integer('category_id')
        .references(() => CategoryTable.categoryId),
    ...timestamps
});
