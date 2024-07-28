'use server'

import { validateRequest } from '@/auth';
import db from '@/database/client'
import { JournalEntryTable, TransactionTable } from '@/database/schemas';
import { CreateJournalEntry, CreateTransaction } from '@/types/post';
import { eq } from 'drizzle-orm';

export const createJournalEntry = async (formData: CreateJournalEntry) => {
	console.log('createJournalEntry:', formData)
	const { user } = await validateRequest();
	
    if (!user) {
		throw new Error('Not authorized.');
    }

	const { memo, transactions } = formData;
	const result = await db
		.insert(JournalEntryTable)
		.values({
			userId: user.id,
			memo,
		})
		.returning({
			journalEntryId: JournalEntryTable.journalEntryId
		});

	const { journalEntryId } = result[0];

	await db
		.insert(TransactionTable)
		.values(transactions.map((transaction) => {
			return {
				journalEntryId,
				amount: transaction.amount,
				transactionType: transaction.transactionType,
				memo: transaction.memo ?? null,
				paymentType: transaction.transactionType,
				transactionMethodId: transaction.transactionMethod.transactionMethodId
			}
		}))
}

export const createTransaction = async () => {
	
}

export const getJournalEntriesByUserId = (userId: string) => {
	return db.query.JournalEntryTable.findMany({
		where: eq(JournalEntryTable.userId, userId),
		with: {
			transactions: true
		}
	});
}
