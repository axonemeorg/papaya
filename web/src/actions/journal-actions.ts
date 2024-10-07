'use server'

import { validateRequest } from '@/auth';
import db from '@/database/client'
import { CategoryTable, JournalEntryTable, TransactionTable } from '@/database/schemas';
import JournalRepository from '@/server/repositories/JournalRepository';
import JournalService from '@/server/services/JournalService';
import TransactionService from '@/server/services/TransactionService';
import { TransactionType } from '@/types/enum';
import { JournalEntry } from '@/types/get';
import { CreateJournalEntry, CreateQuickJournalEntry } from '@/types/post';
import { UpdateJournalEntry } from '@/types/put';
import { and, eq, InferInsertModel } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const createJournalEntry = async (formData: CreateJournalEntry) => {
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
				categoryId: transaction.category?.categoryId,
			}
		}))

	revalidatePath('/journal')
}

export const createQuickJournalEntry = async (formData: CreateQuickJournalEntry) => {
	const { user } = await validateRequest();
	
    if (!user) {
		throw new Error('Not authorized.');
    }

	const { memo, amount, category } = formData;

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
		} as InferInsertModel<typeof JournalEntryTable>)
		.returning({
			journalEntryId: JournalEntryTable.journalEntryId
		});

	const { journalEntryId } = result[0];

	await db
		.insert(TransactionTable)
		.values({
			journalEntryId,
			amount: Number.parseInt(String(100 * Number.parseFloat(amount))),
			transactionType: TransactionType.Enum.DEBIT,
			memo: null,
			paymentType: null,
			transactionMethodId: null,
		});

	revalidatePath('/journal')
}

export const updateJournalEntry = async (formData: UpdateJournalEntry) => {
	const { user } = await validateRequest();
	
    if (!user) {
		throw new Error('Not authorized.');
    }

	const { journalEntryId, memo, transactions, category, date, time } = formData;

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

	await db
		.update(JournalEntryTable)
		.set({
			categoryId: category?.categoryId ?? null,
			memo,
			date,
			time,
		})
		.where(
			and(
				eq(JournalEntryTable.userId, user.id),
				eq(JournalEntryTable.journalEntryId, journalEntryId)
			)
		)
		.returning({
			journalEntryId: JournalEntryTable.journalEntryId
		});

	// Delete existing transactions
	await TransactionService.deleteAllTransactionsByJournalEntryId(journalEntryId)

	// Insert updated transactions
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

	revalidatePath('/journal')
}

export const deleteJournalEntry = async (formData: FormData) => {
    const journalEntryId = String(formData.get('journalEntryId'));
	const { user } = await validateRequest();
	
    if (!user) {
		throw new Error('Not authorized.');
    }

	const response = JournalService.deleteUserJournalEntryById(user.id, journalEntryId);
	revalidatePath('/journal')
	return response;
}

export const getAllJournalEntriesByUserId = (userId: string) => {
	return JournalService.getAllUserJournalEntries(userId);
}

export const getUserJournalEntriesByMonthAndYear = (userId: string, month: string | number, year: string | number) => {
	return JournalService.getUserJournalEntriesByMonthAndYear(userId, month, year);
}
