
import { CreateTransaction } from "@/types/post";
import TransactionRepository from "../repositories/TransactionRepository";

export default class TransactionService {
    static async deleteAllTransactionsByJournalEntryId(journalEntryId: string) {
        return TransactionRepository.deleteAllTransactionsByJournalEntryId(journalEntryId);
    }

    static async insertTransactions(journalEntryId: string, transactions: CreateTransaction[]) {
        const { transactionRecords, transactionsTagRecords } = transactions.reduce(
            (acc: { transactionRecords: any[], transactionsTagRecords: any[] }, transaction: CreateTransaction) => {
                const transactionId = crypto.randomUUID();

                const { transactionRecords, transactionsTagRecords } = acc;
                const record = {
                    transactionId,
                    journalEntryId,
                    amount: Number.parseInt(String(100 * Number.parseFloat(transaction.amount))),
                    transactionType: transaction.transactionType,
                    memo: transaction.memo ?? null,
                    paymentType: transaction.transactionType,
                    transactionMethodId: transaction.transactionMethod?.transactionMethodId,
                    categoryId: transaction.category?.categoryId,
                };

                transactionRecords.push(record);
                transaction.tags.forEach((tag: string) => {
                    transactionsTagRecords.push({
                        transactionId,
                        tag
                    });
                })
                return acc;
            }, {
                transactionRecords: [],
                transactionsTagRecords: [],
            }
        );

        await TransactionRepository.insertTransactions(transactionRecords);
        await TransactionRepository.insertTransactionTags(transactionsTagRecords);
    }
}
