import { CreateTransaction } from "@/types/post";
import TransactionRepository from "../repositories/TransactionRepository";

export default class TransactionService {
    static async deleteAllTransactionsByJournalEntryId(journalEntryId: string) {
        return TransactionRepository.deleteAllTransactionsByJournalEntryId(journalEntryId);
    }

    static async insertTransactions(journalEntryId: string, transactions: CreateTransaction[]) {
        return TransactionRepository.insertTransactions(
            transactions.map((transaction) => {
                return {
                    journalEntryId,
                    amount: Number.parseInt(String(100 * Number.parseFloat(transaction.amount))),
                    transactionType: transaction.transactionType,
                    memo: transaction.memo ?? null,
                    paymentType: transaction.transactionType,
                    transactionMethodId: transaction.transactionMethod?.transactionMethodId,
                    categoryId: transaction.category?.categoryId,
                }
            })
        );
    }
}
