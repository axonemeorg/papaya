import { TransactionType } from "@/types/enum";
import JournalRepository from "../repositories/JournalRepository";


export default class JournalService {
    static async getUserJournalEntries(userId: string) {
        const results = await JournalRepository.getUserJournalEntries(userId);
        return results.map((journalEntry) => {

            const methods = journalEntry
                .transactions
                .reduce((acc, transaction) => {
                    const { method } = transaction;
                    if (method) {
                        acc.push(method);
                    }
                    return acc;
                }, []);
    
            const netAmount = journalEntry
                .transactions
                .reduce((acc, transaction) => {
                    if (transaction.transactionType === TransactionType.Enum.CREDIT) {
                        return acc + transaction.amount;
                    } else if (transaction.transactionType === TransactionType.Enum.DEBIT) {
                        return acc - transaction.amount;
                    }
                    return acc;
                }, 0);

            delete journalEntry.transactions;

            return {
                ...journalEntry,
                methods,
                netAmount,
            }
        })
        // return results;
    }
}