import TransactionRepository from "../repositories/TransactionRepository";

export default class TransactionService {
    static async deleteAllTransactionsByJournalEntryId(journalEntryId: string) {
        return TransactionRepository.deleteAllTransactionsByJournalEntryId(journalEntryId);
    }
}
