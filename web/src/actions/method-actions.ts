'use server'

import db from "@/database/client"
import { TransactionMethodTable } from "@/database/schemas"
import { type CreateTransactionMethod } from "@/types/post";
import { eq } from "drizzle-orm"

export const getTransactionMethodsByUserId = async (userId: string) => {
    return db.query.TransactionMethodTable.findMany({
        where: eq(TransactionMethodTable.userId, userId)
    });
}

export const createTransactionMethod = async (data: CreateTransactionMethod) => {
    const response = await db.insert(TransactionMethodTable).values({
        label: data.label,
        defaultPaymentType: data.defaultPaymentType
    }).returning({
        transactionMethodId: TransactionMethodTable.transactionMethodId,
        // label: TransactionMethodTable.label,
        // defaultPaymentType: TransactionMethodTable.defaultPaymentType,
    });

    return response[0];
}
