import { z } from "zod"
import { PaymentType, TransactionMethodIconVariant, TransactionType } from "./enum";
import { Category, TransactionMethod } from "./get";

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

export const CreateTransactionMethod = z.object({
    label: z.string().min(1, 'A label is required'),
    defaultPaymentType: PaymentType,
    iconContent: z.string(),
    iconVariant: TransactionMethodIconVariant,
    iconPrimaryColor: z.string(),
    iconSecondaryColor: z.string().optional(),
});
export type CreateTransactionMethod = z.infer<typeof CreateTransactionMethod>;
