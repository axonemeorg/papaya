import db from "@/database/client";
import { CategoryTable, JournalEntryTable } from "@/database/schemas";
import { eq } from "drizzle-orm";

export default class JournalRepository {
    static async getUserJournalEntries(userId: string) {
        return db.query.JournalEntryTable.findMany({
            where: eq(JournalEntryTable.userId, userId),
            orderBy: [JournalEntryTable.date, JournalEntryTable.time],
            columns: {
                [JournalEntryTable.journalEntryId.name]: true,
                [JournalEntryTable.memo.name]: true,
                [JournalEntryTable.date.name]: true,
                [JournalEntryTable.time.name]: true,
            },
            with: {
                transactions: true,
                category: {
                    columns: {
                        [CategoryTable.categoryId.name]: true,
                        [CategoryTable.label.name]: true,
                        [CategoryTable.icon.name]: true,
                        [CategoryTable.color.name]: true,
                    }
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
