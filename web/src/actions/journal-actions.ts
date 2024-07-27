import { validateRequest } from '@/auth';
import db from '@/database/client'
import { JournalEntryTable, TransactionTable } from '@/database/schemas';
import { CreateTransaction } from '@/types/post';
import { eq } from 'drizzle-orm';

export const createJournalEntry = async (memo: string, transactions: CreateTransaction[]) => {
	const { user } = await validateRequest();

    if (!user) {
        throw new Error('Not authorized.');
    }

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
				memo: transaction.memo,
				paymentType: transaction.transactionType,
				transactionMethodId: transaction.transactionMethodId
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
