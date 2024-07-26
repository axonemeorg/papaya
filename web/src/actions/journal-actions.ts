import db from '@/database/client'
import { JournalEntryTable } from '@/database/schemas';
import { sql, and, eq, max } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

export const createJournalEntry = async (memo: string, transactions: any[]) => {
	const result = await db
		.insert(JournalEntryTable)
		.values({
			memo
		})
		.returning({
			journalEntryId: JournalEntryTable.journalEntryId
		});

	const { journalEntryId } = result[0];

	// await db
	// 	.insert(Transaction)
	// 	.values()	
}

export const createTransaction = async () => {
	
}

export const getJournalEntries = () => {
	return db.query.JournalEntryTable.findMany({
		with: {
			transactions: true
		}
	});
}
