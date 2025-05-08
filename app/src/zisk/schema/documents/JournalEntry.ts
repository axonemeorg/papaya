import { DocumentSchema, IdentifierMetadata } from "@/schema/support/orm/Document";
import z from "zod";
import { Mixin } from "../support/orm/Mixin";
import { EntryTask } from "./EntryTask";
import { EntryArtifact } from "./EntryArtifact";
import { Figure } from "../models/Figure";
import { StatusVariant } from "../models/EntryStatus";

// const BaseJournalEntry = 

const [CreateBaseJournalEntry, BaseJournalEntry] = DocumentSchema.new(
    {
        kind: z.literal('zisk:entry'),
    },

    // Intrinsic
    IdentifierMetadata
        .extend({
            ...Mixin.intrinsic.natural._ephemeral({
                amount: z.string()
            }),
        })
        .extend({
            date: z.string(),
            memo: z.string(),
            'tagIds': z.array(z.string()).optional(),
            'categoryId': z.string().optional(),
            'sourceAccountId': z.string().optional(),
            'transfer': z.object({
                destAccountId: z.string()
            }).optional(),
            'notes': z.string().optional(),
            'tasks': z.array(EntryTask).optional(),
            'statusIds': z.array(StatusVariant).optional(),
            'artifacts': z.array(EntryArtifact).optional(),
            'relatedEntryIds': z.array(z.string()).optional(),

            // get children() {
            //     return z.array(BaseJournalEntry.omit({ children: true }))
            // },
        }),

    // Derived
    z.object({
        ...Mixin.derived.timestamps(),
        ...Mixin.derived.belongsToJournal(),
        ...z.object(
            Mixin.derived.natural._derived({
                figure: Figure.optional(),
            })).partial().shape,
    })
)

export const CreateJournalEntry = CreateBaseJournalEntry.extend({
    children: z.array(CreateBaseJournalEntry)
})

export const JournalEntry = BaseJournalEntry.extend({
    children: z.array(BaseJournalEntry)
})

export type CreateJournalEntry = z.output<typeof CreateJournalEntry>
export type JournalEntry = z.output<typeof JournalEntry>
