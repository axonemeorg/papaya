import { z } from "zod"

export const TransactionType = z.enum([
    'DEBIT',
    'CREDIT'
]);
export type TransactionType = z.infer<typeof TransactionType>;

export const PaymentType = z.enum([
    'CASH',
    'ETRANSFER',
    'DEBIT',
    'CREDIT',
]);
export type PaymentType = z.infer<typeof PaymentType>;

export const TransactionMethodIconVariant = z.enum([
    'TEXT',
    'PICTORIAL',
    'IMAGE',
]);
export type TransactionMethodIconVariant = z.infer<typeof TransactionMethodIconVariant>;

export const PAYMENT_TYPE_NAMES: Record<PaymentType, string> = {
    CASH: 'Cash',
    ETRANSFER: 'e-Transfer',
    DEBIT: 'Debit Card',
    CREDIT: 'Credit Card',
};
