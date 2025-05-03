import z from "zod"
import { DocumentSchema } from "@/schema/support/document"
import { Avatar } from '@/schema/models/Avatar'
import { Mixin } from "@/schema/support/mixin"

export const [CreateJournal, Journal] = DocumentSchema.new(
    { 
        kind: z.literal('zisk:journal'),
    },
    z.interface({
        journalName: z.string(),
        description: z.string().optional(),
        avatar: Avatar,
    }),
    Mixin.derived.timestamps(),
)

export type CreateJournal = z.output<typeof CreateJournal>
export type Journal = z.output<typeof Journal>
