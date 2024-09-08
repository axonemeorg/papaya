import { z } from "zod"
import { PaymentType, TransactionType } from "./enum";
import { Category, ItemAvatar, TransactionMethod } from "./get";

export const CreateTransaction = z.object({
    transactionType: TransactionType,
    paymentType: PaymentType,
    date: z.string().min(1, "A date is required"),
    amount: z.string().min(0, "A positive number is required"),
    memo: z.string().optional(),
    transactionMethod: TransactionMethod.pick({ transactionMethodId: true })
});
export type CreateTransaction = z.infer<typeof CreateTransaction>;

export const CreateJournalEntry = z.object({
    memo: z.string().min(1, "Add a description"),
    date: z.string(),
    time: z.string(),
    category: Category.pick({ categoryId: true }),
    transactions: z.array(CreateTransaction)
});
export type CreateJournalEntry = z.infer<typeof CreateJournalEntry>;

export const CreateTransactionMethod = ItemAvatar.extend({
    label: z.string().min(1, 'A label is required'),
    defaultPaymentType: PaymentType,
});
export type CreateTransactionMethod = z.infer<typeof CreateTransactionMethod>;

export const CreateCategory = z.object({
    label: z.string().min(1, 'A label is required'),
    description: z.string().min(1, 'A description is required'),
    icon: z.string(),
    color: z.string(),
});
export type CreateCategory = z.infer<typeof CreateCategory>;
