import { DocumentSchema } from "@/schema/support/document";
import z from "zod";
import { Mixin } from "../support/mixin";
import { EntryTask } from "../models/EntryTask";
import { EntryArtifact } from "./EntryArtifact";
import { Figure } from "../models/Figure";
import { EntryStatus } from "../models/EntryStatus";

const BaseJournalEntry = z.interface({
    date: z.string(),
    memo: z.string(),
    tagIds: z.array(z.string()).optional(),
    categoryId: z.string().optional(),
    sourceAccountId: z.string().optional(),
    transfer: z.interface({
        destAccountId: z.string()
    }).optional(),
    notes: z.string().optional(),
    tasks: z.array(z.string()).optional(),
    statusIds: z.array(EntryStatus).optional(),
    artifacts: z.array(EntryArtifact).optional(),
    // recurs: EntryRecurrency.optional(),
    // recurrenceOf: z.string().optional(),
    relatedEntryIds: z.array(z.string()).optional(),
    get children() {
        return z.array(BaseJournalEntry).optional()
    },
});

export const [CreateJournalEntry, JournalEntry] = DocumentSchema.new(
    {
        kind: z.literal('zisk:entry'),
        _ephemeral: z.interface({
            amount: z.string(),
        }).optional(),
        _derived: z.interface({
            figure: Figure.optional(),
            ...Mixin.derived.timestamps(),
        }).optional(),
    },
    BaseJournalEntry.extend(z.interface({
        ...Mixin.intrinsic.belongsToJournal(),
    })),
    z.interface({
        ...Mixin.derived.timestamps(),
    })
)
export type CreateJournalEntry = z.output<typeof CreateJournalEntry>
export type JournalEntry = z.output<typeof JournalEntry>
