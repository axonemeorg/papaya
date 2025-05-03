import { EntryStatus, StatusVariant } from "@/schema/models/EntryStatus";

export const ZiskEntryStatus: EntryStatus[] = [
    {
        kind: 'zisk:status',
        key: StatusVariant.enum.FLAGGED,
        label: 'Flagged',
        description: 'This entry has been flagged for review',
        archived: false,
        disabled: false,
    },
    {
        kind: 'zisk:status',
        key: StatusVariant.enum.NEEDS_REVIEW,
        label: 'Needs Review',
        description: 'This entry needs to be reviewed',
        archived: false,
        disabled: true,
    },
    {
        kind: 'zisk:status',
        key: StatusVariant.enum.WAS_REVIEWED,
        label: 'Reviewed',
        description: 'This entry has been reviewed',
        disabled: true,
        archived: false,
    },
    {
        kind: 'zisk:status',
        key: StatusVariant.enum.APPROXIMATE,
        label: 'Approximate',
        description: 'Amounts are only rough estimates',
        disabled: false,
        archived: false,
    },
    {
        kind: 'zisk:status',
        key: StatusVariant.enum.PENDING,
        label: 'Pending',
        description: 'Entry is pending',
        archived: false,
        disabled: false,
    },
];
