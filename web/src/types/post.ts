import { z } from "zod"
import { PaymentType, TransactionType } from "./enum";
import { Category, ItemAvatar, TransactionMethod } from "./get";

export const CreateTransaction = z.object({
    transactionType: TransactionType,
    date: z.string().min(1, "A date is required"),
    amount: z.string().min(0, "A positive number is required"),
    memo: z.string()
        .optional()
        .nullable(),
    paymentType: PaymentType
        .optional()
        .nullable(),
    transactionMethod: TransactionMethod.pick({ transactionMethodId: true })
        .optional()
        .nullable(),
});
export type CreateTransaction = z.output<typeof CreateTransaction>;

export const CreateJournalEntry = z.object({
    memo: z.string().min(1, "Add a description"),
    date: z.string(),
    time: z.string(),
    category: Category.pick({ categoryId: true })
        .optional()
        .nullable(),
    transactions: z.array(CreateTransaction),
});
export type CreateJournalEntry = z.output<typeof CreateJournalEntry>;

export const CreateQuickJournalEntry = z.object({
    memo: z.string().min(1, "Add a description"),
    category: Category.pick({ categoryId: true })
        .optional()
        .nullable(),
    amount: z.string().min(0, "A positive number is required"),
});
export type CreateQuickJournalEntry = z.output<typeof CreateQuickJournalEntry>;

export const CreateTransactionMethod = ItemAvatar.extend({
    label: z.string().min(1, 'A label is required'),
    defaultPaymentType: PaymentType,
});
export type CreateTransactionMethod = z.output<typeof CreateTransactionMethod>;

export const CreateCategory = ItemAvatar.extend({
    label: z.string().min(1, 'A label is required'),
    description: z.string().min(1, 'A description is required'),
});
export type CreateCategory = z.output<typeof CreateCategory>;

export const LoginCredentials = z.object({
    username: z.string().email('A valid email is required'),
    password: z.string().min(1, 'A password is required')
});
export type LoginCredentials = z.output<typeof LoginCredentials>;

export const SignupCredentials = z.object({
    username: z.string().email('A valid email is required'),
    password: z.string().min(1, 'A password is required')
});
export type SignupCredentials = z.output<typeof SignupCredentials>;
