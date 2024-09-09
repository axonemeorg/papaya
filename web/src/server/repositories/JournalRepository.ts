import db from "@/database/client";
import { JournalEntryTable, TransactionTable } from "@/database/schemas";
import { and, eq, gte, lt } from "drizzle-orm";

export default class JournalRepository {
    static async getUserJournalEntries(userId: string) {
        return db.query.JournalEntryTable.findMany({
            where: eq(JournalEntryTable.userId, userId),
            orderBy: [JournalEntryTable.date, JournalEntryTable.time],
            columns: {
                journalEntryId: true,
                memo: true,
                date: true,
                time: true,
            },
            with: {
                transactions: {
                    with: {
                        method: {
                            columns: {
                                label: true,
                                avatarContent: true,
                                avatarVariant: true,
                                avatarPrimaryColor: true,
                                avatarSecondaryColor: true,
                            }
                        }
                    },
                    columns: {
                        transactionId: true,
                        amount: true,
                        transactionType: true,
                    }
                },
                category: {
                    columns: {
                        categoryId: true,
                        label: true,
                        avatarContent: true,
                        avatarVariant: true,
                        avatarPrimaryColor: true,
                        avatarSecondaryColor: true,
                    },
                    
                },
            },
        });
    }

    static async getUserJournalEntriesByMonthAndYear(userId: string, month: string | number, year: string | number) {
        const formattedMonth = (`0${month}`).slice(-2);
        const formattedNextMonth = (`0${Number(month)  + 1}`).slice(-2);
        const minDate = `${year}-${formattedMonth}-01`;
        const maxDate = `${year}-${formattedNextMonth}-01`;
        return db.query.JournalEntryTable.findMany({
            where: and(
                eq(JournalEntryTable.userId, userId),
                gte(JournalEntryTable.date, minDate),
                lt(JournalEntryTable.date, maxDate),
            ),
            orderBy: [JournalEntryTable.date, JournalEntryTable.time],
            columns: {
                journalEntryId: true,
                memo: true,
                date: true,
                time: true,
            },
            with: {
                transactions: {
                    with: {
                        method: {
                            columns: {
                                label: true,
                                avatarContent: true,
                                avatarVariant: true,
                                avatarPrimaryColor: true,
                                avatarSecondaryColor: true,
                            }
                        }
                    },
                    columns: {
                        transactionId: true,
                        amount: true,
                        transactionType: true,
                    }
                },
                category: {
                    columns: {
                        categoryId: true,
                        label: true,
                        avatarContent: true,
                        avatarVariant: true,
                        avatarPrimaryColor: true,
                        avatarSecondaryColor: true,
                    },
                    
                },
            },
        });
    }

    // static async getUserJournalEntriesByMonthAndYear(userId: string, month: number, year: number) {
    //     return await JournalEntryTable
    //         .select()
    //         .where({ userId, month, year })
    //         .orderBy('date', 'desc')
    //         .run();
    // }

    // static async getUserJournalEntriesByCategory(userId: string, categoryId: string) {
    //     return await JournalEntryTable
    //         .select()
    //         .where({ userId, categoryId })
    //         .orderBy('date', 'desc')
    //         .run();
    // }

    // static async getUserJournalEntriesByTransactionMethod(userId: string, transactionMethodId: string) {
    //     return await JournalEntryTable
    //         .select()
    //         .where({ userId, transactionMethodId })
    //         .orderBy('date', 'desc')
    //         .run();
    // }

    // static async getUserJournalEntriesByTransactionType(userId: string, transactionType: string) {
    //     return await JournalEntryTable
    //         .select()
    //         .where({ userId, transactionType })
    //         .orderBy('date', 'desc')
    //         .run();
    // }

    // static async getUserJournalEntriesByPaymentType(userId: string, paymentType: string) {
    //     return await JournalEntryTable
    //         .select()
    //         .where({ userId, paymentType })
    //         .orderBy('date', 'desc')
    //         .run();
    // }

}
