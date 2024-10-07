import db from "@/database/client";
import { JournalEntryTable, TransactionTable } from "@/database/schemas";
import { and, eq, gte, lt } from "drizzle-orm";

export default class JournalRepository {
    static async getAllUserJournalEntries(userId: string) {
        return this.getUserJournalEntriesByMonthAndYear(userId, null, null);
    }

    static async getUserJournalEntriesByMonthAndYear(userId: string, month: string | number | null, year: string | number | null) {
        const formattedMonth = month ? (`0${month}`).slice(-2) : null;
        const formattedNextMonth = month ? (`0${Number(month)  + 1}`).slice(-2) : null;
        
        const minDate = year && formattedMonth ? `${year}-${formattedMonth}-01` : null;
        const maxDate = year && formattedMonth ? `${year}-${formattedNextMonth}-01` : null;

        const where = minDate && maxDate
            ? and(
                eq(JournalEntryTable.userId, userId),
                gte(JournalEntryTable.date, minDate),
                lt(JournalEntryTable.date, maxDate),
            )
            : eq(JournalEntryTable.userId, userId);
        

        return db.query.JournalEntryTable.findMany({
            where,
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
                    columns: {
                        transactionId: true,
                        amount: true,
                        memo: true,
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

    static async deleteUserJournalEntryById(userId: string, journalEntryId: string) {
        console.log('deleteUserJournalEntryById', userId, journalEntryId)
        const response = await db.delete(JournalEntryTable)
            .where(
                and(
                    eq(JournalEntryTable.userId, userId),
                    eq(JournalEntryTable.journalEntryId, journalEntryId)
                )
            )
            .returning({
                journalEntryId: JournalEntryTable.journalEntryId
            });

        return response;
    }
}
