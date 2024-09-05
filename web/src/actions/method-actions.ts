'use server'

import { validateRequest } from "@/auth";
import db from "@/database/client"
import { TransactionMethodTable } from "@/database/schemas"
import TransactionMethodService from "@/server/services/TransactionMethodService";
import { type CreateTransactionMethod } from "@/types/post";
import { eq } from "drizzle-orm"

export const getTransactionMethodsByUserId = async (userId: string) => {
    return TransactionMethodService.getUserTransactionMethods(userId);
}

export const createTransactionMethod = async (method: CreateTransactionMethod) => {
    const { user } = await validateRequest();

    if (!user) {
        throw new Error('Not authorized.');
    }

    const response = await db.insert(TransactionMethodTable).values({
        userId: user.id,
        label: method.label,
        defaultPaymentType: method.defaultPaymentType,
        iconVariant: method.iconVariant,
        iconContent: method.iconContent,
        iconPrimaryColor: method.iconPrimaryColor,
        iconSecondaryColor: method.iconSecondaryColor,
    }).returning({
        transactionMethodId: TransactionMethodTable.transactionMethodId,
    });

    return response[0];
}
