import db from "@/database/client"
import { TransactionMethodTable } from "@/database/schemas"
import { eq } from "drizzle-orm"

export const getTransactionMethodsByUserId = async (userId: string) => {
    return db.query.TransactionMethodTable.findMany({
        where: eq(TransactionMethodTable.userId, userId)
    });
}
