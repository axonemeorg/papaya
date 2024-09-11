import {
    varchar,
    pgTable,
    date,
    time,
    timestamp,
    integer,
    index,
    text,
    vector,
    uuid,
} from 'drizzle-orm/pg-core'

const EMBEDDING_NUM_DIMENSIONS = 1536 as const;

import { AvatarVariantEnum, PaymentTypeEnum, TransactionTypeEnum } from './enums';
import { UserTable } from './auth';

const timestamps = {
    createdAt: timestamp('created_at')
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at'),
}

const avatar = {
    avatarContent: varchar('avatar_content', { length: 1024 })
        .notNull(),
    avatarVariant: AvatarVariantEnum('avatar_variant')
        .notNull(),
    avatarPrimaryColor: varchar('avatar_primary_color', { length: 64 }),
    avatarSecondaryColor: varchar('avatar_secondary_color', { length: 64 }),
}

export const TransactionMethodTable = pgTable("transaction_method", {
    transactionMethodId: uuid('transaction_method_id')
        .defaultRandom()
        .primaryKey(),
    userId: text('user_id').references(() => UserTable.id)
        .notNull(),
    label: varchar('label', { length: 128 })
        .notNull(),
    defaultPaymentType: PaymentTypeEnum('default_payment_type')
        .notNull(),

    ...avatar,
    ...timestamps
});

export const TransactionTable = pgTable("transaction", {
    transactionId: uuid('transaction_id')
        .defaultRandom()
        .primaryKey(),
    journalEntryId: uuid('journal_entry_id')
        .references(() => JournalEntryTable.journalEntryId, { onDelete: 'cascade' })
        .notNull(),
    transactionType: TransactionTypeEnum('transaction_type')
        .notNull(),
    paymentType: PaymentTypeEnum('payment_type'),
    amount: integer('amount')
        .notNull(),
    memo: varchar('memo', { length: 1024 }),
    transactionMethodId: uuid('transaction_method_id')
        .references(() => TransactionMethodTable.transactionMethodId),

    ...timestamps
});

export const CategoryTable = pgTable("category", {
    categoryId: uuid('category_id')
        .defaultRandom()
        .primaryKey(),
    label: varchar('label', { length: 128 })
        .notNull(),
    description: varchar('description', { length: 1024 })
        .notNull(),
    descriptionEmbedding: vector('description_embedding', { dimensions: EMBEDDING_NUM_DIMENSIONS })
        .notNull(),
    userId: text('user_id')
        .references(() => UserTable.id)
        .notNull(),

    ...avatar,
    ...timestamps,
}, (table) => ({
    embeddingIndex: index('embedding_index')
        .using('hnsw', table.descriptionEmbedding.op('vector_cosine_ops'))
}));

export const JournalEntryTable = pgTable("journal_entry", {
    journalEntryId: uuid('journal_entry_id')
        .defaultRandom()
        .primaryKey(),
    memo: varchar('memo', { length: 1024 })
        .notNull(),
    date: date('date')
        .notNull(),
    time: time('time')
        .notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => UserTable.id),
    categoryId: uuid('category_id')
        .references(() => CategoryTable.categoryId),

    ...timestamps
});
