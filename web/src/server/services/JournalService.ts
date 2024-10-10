import { TransactionType } from "@/types/enum";
import JournalRepository from "../repositories/JournalRepository";
import { Transaction } from "@/types/get";
import { validateRequest } from "@/auth";
import { CreateJournalEntry, CreateQuickJournalEntry, CreateTransaction } from "@/types/post";
import CategoryService from "./CategoryService";
import TransactionService from "./TransactionService";
import { UpdateJournalEntry } from "@/types/put";
import { InferInsertModel } from "drizzle-orm";
import { JournalEntryTable } from "@/database/schemas";


export default class JournalService {
    static async _santizeJournalEntries(results: any) {
        return results.map((journalEntry: any) => {
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

            return {
                ...journalEntry,
                netAmount,
            }
        })
    }

    static async getAllUserJournalEntries() {
        const { user } = await validateRequest();

        if (!user) {
            throw new Error('Not authorized.');
        }

        const results = await JournalRepository.getAllUserJournalEntries(user.id);
        
        return this._santizeJournalEntries(results);
    }

    static async getUserJournalEntriesByMonthAndYear(month: string | number, year: string | number) {
        const { user } = await validateRequest();

        if (!user) {
            throw new Error('Not authorized.');
        }

        const results = await JournalRepository.getUserJournalEntriesByMonthAndYear(user.id, month, year);        
        return this._santizeJournalEntries(results);
    }

    static async createJournalEntry(formData: CreateJournalEntry) {
        const { user } = await validateRequest();
	
        if (!user) {
            throw new Error('Not authorized.');
        }

        const { memo, transactions, category, date, time } = formData;

        if (category) {
            // Ensure that the given category belongs to the user
            const categoryResult = await CategoryService.getUserCategoryById(category.categoryId);

            if (!categoryResult) {
                throw new Error('Category could not be found.')
            }
        }

        const { journalEntryId } = await JournalRepository.insertJournalEntry({
            userId: user.id,
            categoryId: category?.categoryId ?? undefined,
            memo,
            date,
            time,
        });

        await TransactionService.insertTransactions(journalEntryId, transactions);
    }

    static async createQuickJournalEntry(formData: CreateQuickJournalEntry) {
        const { user } = await validateRequest();
	
        if (!user) {
            throw new Error('Not authorized.');
        }

        const { memo, amount, category } = formData;

        if (category) {
            // Ensure that the given category belongs to the user
            const categoryResult = await CategoryService.getUserCategoryById(category.categoryId);

            if (!categoryResult) {
                throw new Error('Category could not be found.')
            }
        }

        /**
         * TODO currently, we rely on the default date and time values from the database
         * when creating a quick journal entry. We should instead calculate the current date
         * and time on the server and pass it to the database, in order to account for timezones.
         */
        const date = undefined;
        const time = undefined;

        const { journalEntryId } = await JournalRepository.insertJournalEntry({
            userId: user.id,
            categoryId: category?.categoryId ?? undefined,
            memo,
            date,
            time,
        });

        const transaction: CreateTransaction = {
            amount,
            transactionType: TransactionType.Enum.DEBIT,
            memo: null,
            paymentType: null,
            transactionMethod: null,
            category: null,
            tags: [],
        }

        await TransactionService.insertTransactions(journalEntryId, [transaction]);
    }

    static async updateJournalEntry(formData: UpdateJournalEntry) {
        const { user } = await validateRequest();
        
        if (!user) {
            throw new Error('Not authorized.');
        }

        const { journalEntryId, memo, transactions, category, date, time } = formData;

        if (category) {
            // Ensure that the given category belongs to the user
            const categoryResult = await CategoryService.getUserCategoryById(category.categoryId);

            if (!categoryResult) {
                throw new Error('Category could not be found.')
            }
        }

        const updatedJournalEntryValues: InferInsertModel<typeof JournalEntryTable> = {
            journalEntryId,
            userId: user.id,
            categoryId: category?.categoryId ?? null,
            memo,
            date,
            time,
        }

        await JournalRepository.updateJournalEntry(updatedJournalEntryValues);

        // Delete existing transactions
        await TransactionService.deleteAllTransactionsByJournalEntryId(journalEntryId)

        // Insert updated transactions
        await TransactionService.insertTransactions(journalEntryId, transactions);
    }

    static async deleteUserJournalEntryById(journalEntryId: string) {
        const { user } = await validateRequest();
	
        if (!user) {
            throw new Error('Not authorized.');
        }

        return JournalRepository.deleteUserJournalEntryById(user.id, journalEntryId);
    }

    static async removeCategoryFromJournalEntries(categoryId: string) {
        const { user } = await validateRequest();
    
        if (!user) {
            throw new Error('Not authorized.');
        }

        return JournalRepository.removeCategoryFromJournalEntries(user.id, categoryId);
    }
}
