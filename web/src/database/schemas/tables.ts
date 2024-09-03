import {
    sqliteTable,
    integer,
    index,
    text,
} from 'drizzle-orm/sqlite-core'

const EMBEDDING_NUM_DIMENSIONS = 1536 as const;

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
    icon: varchar('icon', { length: 1023 })
        .notNull(),
    color: varchar('color', { length: 64 })
        .notNull(),
    description: varchar('description', { length: 1024 })
        .notNull(),
    descriptionEmbedding: vector('description_embedding', { dimensions: EMBEDDING_NUM_DIMENSIONS })
        .notNull(),
    userId: text('user_id')
        .references(() => UserTable.id)
        .notNull(),

    ...timestamps,
}, (table) => ({
    embeddingIndex: index('embedding_index').using('hnsw', table.descriptionEmbedding.op('vector_cosine_ops'))
}));

export const JournalEntryTable = pgTable("journal_entry", {
    journalEntryId: serial('journal_entry_id').primaryKey(),
    memo: varchar('memo', { length: 1024 }).notNull(),
    date: date('date').notNull(),
    time: time('time').notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => UserTable.id),
    categoryId: integer('category_id')
        .references(() => CategoryTable.categoryId),
    ...timestamps
});
