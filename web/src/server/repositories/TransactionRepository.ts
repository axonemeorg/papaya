import db from "@/database/client";
import { JournalEntryTable, TransactionTable } from "@/database/schemas";
import { CreateTransaction } from "@/types/post";
import { and, eq } from "drizzle-orm";

export default class TransactionRepository {
    static async insertTransactions(journalEntryId: string, transactions: CreateTransaction[]) {
        const response = db
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
            }));

        return response;
    }

    static async deleteAllTransactionsByJournalEntryId(journalEntryId: string) {
        const response = await db.delete(TransactionTable)
            .where(
                and(
                    eq(TransactionTable.journalEntryId, journalEntryId)
                )
            )
            .returning({
                transactionId: TransactionTable.transactionId
            });

        return response;
    }
}
