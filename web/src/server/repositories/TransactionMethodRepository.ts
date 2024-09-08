import db from "@/database/client";
import { TransactionMethodTable } from "@/database/schemas";
import { eq } from "drizzle-orm";

export default class TransactionMethodRepository {
    static async getUserTransactionMethods(userId: string) {
        return db.query.TransactionMethodTable.findMany({
            where: eq(TransactionMethodTable.userId, userId),
            columns: {
                transactionMethodId: true,
                label: true,
                avatarContent: true,
                avatarVariant: true,
                avatarPrimaryColor: true,
                avatarSecondaryColor: true,
            }
        });
    }
}
