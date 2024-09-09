'use server'

import { validateRequest } from '@/auth';
import db from '@/database/client'
import { CategoryTable, JournalEntryTable, TransactionTable } from '@/database/schemas';
import JournalRepository from '@/server/repositories/JournalRepository';
import JournalService from '@/server/services/JournalService';
import { CreateJournalEntry } from '@/types/post';
import { and, eq, InferInsertModel } from 'drizzle-orm';

export const createJournalEntry = async (formData: CreateJournalEntry) => {
	console.log('createJournalEntry:', formData)
	const { user } = await validateRequest();
	
    if (!user) {
		throw new Error('Not authorized.');
    }

	const { memo, transactions, category, date, time } = formData;

	if (category) {
		// Ensure that the given category belongs to the user
		const categoryResult = await db.query.CategoryTable.findFirst({
			where: and(
				eq(CategoryTable.userId, user.id),
				eq(CategoryTable.categoryId, category.categoryId)
			)
		})

		if (!categoryResult) {
			throw new Error('Category could not be found.')
		}
	}

	const result = await db
		.insert(JournalEntryTable)
		.values({
			userId: user.id,
			categoryId: category?.categoryId ?? undefined,
			memo,
			date,
			time,
		} as InferInsertModel<typeof JournalEntryTable>)
		.returning({
			journalEntryId: JournalEntryTable.journalEntryId
		});

	const { journalEntryId } = result[0];

	console.log('transactions:', transactions)

	await db
		.insert(TransactionTable)
		.values(transactions.map((transaction) => {
			return {
				journalEntryId,
				amount: Number.parseInt(String(100 * Number.parseFloat(transaction.amount))),
				transactionType: transaction.transactionType,
				memo: transaction.memo ?? null,
				paymentType: transaction.transactionType,
				transactionMethodId: transaction.transactionMethod?.transactionMethodId,
			}
		}))
}

export const getJournalEntriesByUserId = (userId: string) => {
	return JournalService.getUserJournalEntries(userId);
}

export const getUserJournalEntriesByMonthAndYear = (userId: string, month: string | number, year: string | number) => {
	return JournalService.getUserJournalEntriesByMonthAndYear(userId, month, year);
}
