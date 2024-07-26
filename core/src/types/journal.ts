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

export const CreateTransaction = z.object({
    type: TransactionType,
    date: z.string().min(1, "A date is required"),
    amount: z.number(),
    memo: z.string().optional(),
    paymentType: PaymentType,
    transactionMethodId: z.number()
});
export type CreateTransaction = z.infer<typeof CreateTransaction>;

export const CreateJournalEntry = z.object({
    memo: z.string().min(1, "Add a description"),
    transactions: z.array(CreateTransaction)
});
export type CreateJournalEntry = z.infer<typeof CreateJournalEntry>;

export const TransactionMethod = z.object({
    label: z.string(),
    defaultPaymentType: PaymentType,
    // icon: string;
});
export type TransactionMethod = z.infer<typeof TransactionMethod>;
