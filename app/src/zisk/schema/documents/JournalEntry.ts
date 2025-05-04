import { DocumentSchema, IdentifierMetadata } from "@/schema/support/orm/Document";
import z from "zod";
import { Mixin } from "../support/orm/Mixin";
import { EntryTask } from "./EntryTask";
import { EntryArtifact } from "./EntryArtifact";
import { Figure } from "../models/Figure";
import { StatusVariant } from "../models/EntryStatus";

const BaseJournalEntry = IdentifierMetadata.extend(z.interface({
    date: z.string(),
    memo: z.string(),
    'tagIds?': z.array(z.string()).optional(),
    'categoryId?': z.string().optional(),
    'sourceAccountId?': z.string().optional(),
    'transfer?': z.interface({
        destAccountId: z.string()
    }).optional(),
    'notes?': z.string().optional(),
    'tasks?': z.array(EntryTask).optional(),
    'statusIds?': z.array(StatusVariant).optional(),
    'artifacts?': z.array(EntryArtifact).optional(),
    'relatedEntryIds?': z.array(z.string()).optional(),

    get children() {
        return z.array(BaseJournalEntry.omit({ children: true }))
    },
}))

export const [CreateJournalEntry, JournalEntry] = DocumentSchema.new(
    {
        kind: z.literal('zisk:entry'),
    },

    // Intrinsic
    BaseJournalEntry
        .extend(Mixin.intrinsic.natural
            ._ephemeral({ amount: z.string() })
            .partial()
        ),

    // Derived
    Mixin.derived.timestamps()
        .extend(Mixin.derived.belongsToJournal())
        .extend(
            (
                Mixin.derived.natural
                    ._derived({
                        figure: Figure.optional(),
                    })
                    .partial()
            )
        )
)

export type CreateJournalEntry = z.output<typeof CreateJournalEntry>
export type JournalEntry = z.output<typeof JournalEntry>
