import { EntryStatus, StatusVariant } from "@/schema/models/EntryStatus";

export const STATUSES: EntryStatus[] = [
    {
        kind: 'zisk:status',
        key: StatusVariant.enum.FLAGGED,
        label: 'Flagged',
        description: 'This entry has been flagged for review',
    },
    {
        kind: 'zisk:status',
        key: StatusVariant.enum.NEEDS_REVIEW,
        label: 'Needs Review',
        disabled: true,
        description: 'This entry needs to be reviewed',
    },
    {
        kind: 'zisk:status',
        key: StatusVariant.enum.WAS_REVIEWED,
        label: 'Reviewed',
        disabled: true,
        description: 'This entry has been reviewed',
    },
    {
        kind: 'zisk:status',
        key: StatusVariant.enum.APPROXIMATE,
        label: 'Approximate',
        description: 'Amounts are only rough estimates'
    },
    {
        kind: 'zisk:status',
        key: StatusVariant.enum.PENDING,
        label: 'Pending',
        description: 'Entry is pending'
    },
];
