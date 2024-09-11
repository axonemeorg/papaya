import db from "@/database/client";
import { JournalEntryTable, TransactionTable } from "@/database/schemas";
import { and, eq } from "drizzle-orm";

export default class TransactionRepository {
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
