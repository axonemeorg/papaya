import {
    varchar,
    pgTable,
    timestamp,
    integer,
    text,
} from 'drizzle-orm/pg-core'

export const UserTable = pgTable("user", {
	id: text("id").primaryKey(),
	username: varchar('username', { length: 64 }).unique().notNull(),
	passwordHash: varchar('password_hash', { length: 256 }).notNull(),
});

export const SessionTable = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => UserTable.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
});
