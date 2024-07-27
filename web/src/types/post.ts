import { z } from "zod"
import { PaymentType, TransactionType } from "./enum";
import { TransactionMethod } from "./get";

export const CreateTransaction = z.object({
    transactionType: TransactionType,
    paymentType: PaymentType,
    date: z.string().min(1, "A date is required"),
    amount: z.number(),
    memo: z.string().optional(),
    transactionMethod: TransactionMethod
});
export type CreateTransaction = z.infer<typeof CreateTransaction>;

export const CreateJournalEntry = z.object({
    memo: z.string().min(1, "Add a description"),
    transactions: z.array(CreateTransaction)
});
export type CreateJournalEntry = z.infer<typeof CreateJournalEntry>;

export const CreateTransactionMethod = z.object({
    label: z.string().min(1, 'A label is required'),
    defaultPaymentType: PaymentType,
    // icon: string;
});
export type CreateTransactionMethod = z.infer<typeof CreateTransactionMethod>;
