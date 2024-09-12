import { z } from "zod"
import { PaymentType, TransactionType } from "./enum";
import { Category, TransactionMethod } from "./get";
import { CreateCategory, CreateJournalEntry } from "./post";

// TODO these are not needed. Transactions cannot be updated. They are erased upon editing a journal entry.
// export const UpdateTransaction = z.object({
//     transactionType: TransactionType,
//     date: z.string().min(1, "A date is required"),
//     amount: z.string().min(0, "A positive number is required"),
//     memo: z.string()
//         .optional()
//         .nullable(),
//     paymentType: PaymentType
//         .optional()
//         .nullable(),
//     transactionMethod: TransactionMethod.pick({ transactionMethodId: true })
//         .optional()
//         .nullable(),
// });
// export type UpdateTransaction = z.output<typeof UpdateTransaction>;

export const UpdateJournalEntry = CreateJournalEntry.extend({
    journalEntryId: z.string().min(1, "Journal entry ID is required"),
});
export type UpdateJournalEntry = z.output<typeof UpdateJournalEntry>;

export const UpdateCategory = CreateCategory.extend({
    categoryId: z.string().min(1, "Category ID is required"),
});
export type UpdateCategory = z.output<typeof UpdateCategory>;
