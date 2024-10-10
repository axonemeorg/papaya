import db from "@/database/client";
import { JournalEntryAttachmentTable, JournalEntryTable, TransactionTable } from "@/database/schemas";
import { and, eq, gte, InferInsertModel, lt } from "drizzle-orm";

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
                entryNumber: true,
                memo: true,
                date: true,
                time: true,
            },
            with: {
                transactions: {
                    with: {
                        tags: {
                            columns: {
                                tag: true,
                            },
                        },
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

    static async insertJournalEntry(values: InferInsertModel<typeof JournalEntryTable>) {
        const result = await db
            .insert(JournalEntryTable)
            .values({
                userId: values.userId,
                categoryId: values.categoryId,
                memo: values.memo,
            } as InferInsertModel<typeof JournalEntryTable>)
            .returning({
                journalEntryId: JournalEntryTable.journalEntryId
            });

        const { journalEntryId } = result[0];
        return { journalEntryId };
    }

    static async updateJournalEntry(values: InferInsertModel<typeof JournalEntryTable>) {
        return db
            .update(JournalEntryTable)
            .set({
                categoryId: values.categoryId,
                memo: values.memo,
                date: values.date,
                time: values.time,
            })
            .where(
                and(
                    eq(JournalEntryTable.userId, values.userId),
                    eq(JournalEntryTable.journalEntryId, values.journalEntryId as string)
                )
            )
            .returning({
                journalEntryId: JournalEntryTable.journalEntryId
            });
    }

    static async deleteUserJournalEntryById(userId: string, journalEntryId: string) {
        console.log('deleteUserJournalEntryById', userId, journalEntryId);
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

    static async removeCategoryFromJournalEntries(userId: string, categoryId: string) {
        return db.update(JournalEntryTable)
            .set({
                categoryId: null,
            })
            .where(
                and(
                    eq(JournalEntryTable.userId, userId),
                    eq(JournalEntryTable.categoryId, categoryId)
                )
            )
    }

    static async insertJournalEntryAttachmentRecord(values: InferInsertModel<typeof JournalEntryAttachmentTable>) {
        const records = await db
            .insert(JournalEntryAttachmentTable)
            .values({
                journalEntryId: values.journalEntryId,
                userFileUploadId: values.userFileUploadId,
            })
            .returning({
                journalEntryAttachmentId: JournalEntryAttachmentTable.journalEntryAttachmentId,
            });

        return records[0];
    }
}
