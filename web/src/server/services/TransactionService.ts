import { CreateTransaction } from "@/types/post";
import TransactionRepository from "../repositories/TransactionRepository";

export default class TransactionService {
    static async deleteAllTransactionsByJournalEntryId(journalEntryId: string) {
        return TransactionRepository.deleteAllTransactionsByJournalEntryId(journalEntryId);
    }

    static async insertTransactions(journalEntryId: string, transactions: CreateTransaction[]) {
        return TransactionRepository.insertTransactions(journalEntryId, transactions);
    }
}
