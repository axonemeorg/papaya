import z from "zod"
import { ModelSchema } from "../support/orm/Model"

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
        label: z.string(),
        description: z.string(),
        key: StatusVariant,
        /**
         * The Reserved Tag is not selectable within the app.
         */
        disabled: z.boolean(),
        /**
         * The Reserved Tag is no longer used.
         */
        archived: z.boolean(),
    })
);
export type EntryStatus = z.output<typeof EntryStatus>;
