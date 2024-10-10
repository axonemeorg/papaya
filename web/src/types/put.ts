import { z } from "zod"
import { CreateCategory, CreateJournalEntry } from "./post";

export const UpdateJournalEntry = CreateJournalEntry.extend({
    journalEntryId: z.string().min(1, "Journal entry ID is required"),
});
export type UpdateJournalEntry = z.output<typeof UpdateJournalEntry>;

export const UpdateCategory = CreateCategory.extend({
    categoryId: z.string().min(1, "Category ID is required"),
});
export type UpdateCategory = z.output<typeof UpdateCategory>;
