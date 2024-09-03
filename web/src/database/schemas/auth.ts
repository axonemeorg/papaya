import {
    sqliteTable,
    text,
} from 'drizzle-orm/sqlite-core'

export const UserTable = sqliteTable("user", {
	id: text("id").primaryKey(),
	username: text('username', { length: 64 })
		.unique()
		.notNull(),
	passwordHash: text('password_hash', { length: 256 })
		.notNull(),
});

export const SessionTable = sqliteTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => UserTable.id),
	expiresAt: text("expires_at").notNull()
});
