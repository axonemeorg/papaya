import { TransactionType } from "@/types/enum";
import JournalRepository from "../repositories/JournalRepository";
import { Transaction } from "@/types/get";


export default class JournalService {
    static async _santizeJournalEntries(results: any) {
        return results.map((journalEntry: any) => {

            // const methods = journalEntry
            //     .transactions
            //     .reduce((acc, transaction) => {
            //         const { method } = transaction;
            //         if (method) {
            //             acc.push(method);
            //         }
            //         return acc;
            //     }, []);
    
            const netAmount = journalEntry
                .transactions
                .reduce((acc: number, transaction: Transaction) => {
                    if (transaction.transactionType === TransactionType.Enum.CREDIT) {
                        return acc + transaction.amount;
                    } else if (transaction.transactionType === TransactionType.Enum.DEBIT) {
                        return acc - transaction.amount;
                    }
                    return acc;
                }, 0);

            // delete journalEntry.transactions;

            return {
                ...journalEntry,
                // methods,
                netAmount,
            }
        })
    }

    static async getAllUserJournalEntries(userId: string) {
        const results = await JournalRepository.getAllUserJournalEntries(userId);
        
        return this._santizeJournalEntries(results);
    }

    static async getUserJournalEntriesByMonthAndYear(userId: string, month: string | number, year: string | number) {
        const results = await JournalRepository.getUserJournalEntriesByMonthAndYear(userId, month, year);
        
        return this._santizeJournalEntries(results);
    }

    static async deleteUserJournalEntryById(userId: string, journalEntryId: string) {
        return JournalRepository.deleteUserJournalEntryById(userId, journalEntryId);
    }
}
