import z from "zod"
import { CreateEntryTag } from "../documents/EntryTag"
import { ModelSchema } from "../support/model"

export const StatusVariant = z.enum([
    'FLAGGED',
    'NEEDS_REVIEW',
    'WAS_REVIEWED',
    'APPROXIMATE',
    'PENDING',
])

export type StatusVariant = z.output<typeof StatusVariant>

export const EntryStatus = ModelSchema.from(
    {
        kind: z.literal('zisk:status')
    },
    z.interface({
        key: StatusVariant,
        label: z.string(),
        description: z.string(),
        /**
         * The Reserved Tag is not selectable within the app.
         */
        'disabled?': z.boolean().optional(),
        /**
         * The Reserved Tag is no longer used.
         */
        'archived?': z.boolean().optional(),
    })
);
export type EntryStatus = z.output<typeof EntryStatus>;
