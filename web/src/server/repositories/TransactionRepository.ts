import db from "@/database/client";
import { JournalEntryTable, TransactionTable, TransactionTagTable } from "@/database/schemas";
import { CreateTransaction } from "@/types/post";
import { and, eq, InferInsertModel } from "drizzle-orm";

export default class TransactionRepository {
    static async insertTransactions(values: InferInsertModel<typeof TransactionTable>[]) {
        const response = await db
            .insert(TransactionTable)
            .values(values);

        return response;
    }

    static async insertTransactionTags(values: InferInsertModel<typeof TransactionTagTable>[]) {
        const response = await db
            .insert(TransactionTagTable)
            .values(values);

        return response;
    }

    static async deleteAllTransactionsByJournalEntryId(journalEntryId: string) {
        const response = await db.delete(TransactionTable)
            .where(
                and(
                    eq(TransactionTable.journalEntryId, journalEntryId)
                )
            )
            .returning({
                transactionId: TransactionTable.transactionId
            });

        return response;
    }
}
