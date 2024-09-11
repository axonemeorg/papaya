import { z } from "zod"
import { PaymentType, TransactionType } from "./enum";
import { Category, TransactionMethod } from "./get";

export const UpdateTransaction = z.object({

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
export type UpdateTransaction = z.output<typeof UpdateTransaction>;

export const UpdateJournalEntry = z.object({
    journalEntryId: z.string().min(1, "Journal entry ID is required"),
    memo: z.string().min(1, "Add a description"),
    date: z.string(),
    time: z.string(),
    category: Category.pick({ categoryId: true })
        .optional()
        .nullable(),
    transactions: z.array(UpdateTransaction),
});
export type UpdateJournalEntry = z.output<typeof UpdateJournalEntry>;
