import { DocumentSchema } from "@/schema/support/document";
import z from "zod";
import { Mixin } from "../support/mixin";
import { EntryTask } from "../models/task";

export const [CreateJournalEntry, JournalEntry] = DocumentSchema.new(
    { kind: z.literal('zisk:entry') },
    z.interface({
        ...Mixin.intrinsic.belongsToJournal(),
        memo: z.string(),
        tagIds: z.array(z.string()).optional(),
        categoryId: z.string().optional(),
        sourceAccountId: z.string().optional(),
        date: z.string().optional(),
        notes: z.string().optional(),
        tasks: z.array(EntryTask).optional(),
        artifacts: z.array(EntryArtifact).optional(),
        recurs: EntryRecurrency.optional(),
        recurrenceOf: z.string().optional(),
        relatedEntryIds: z.array(z.string()).optional(),
    }),
    z.interface({
        ...Mixin.derived.timestamps(),
    })
)
export type CreateJournalEntry = z.output<typeof CreateJournalEntry>
export type JournalEntry = z.output<typeof JournalEntry>
