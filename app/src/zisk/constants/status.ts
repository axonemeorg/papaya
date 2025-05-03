import { EntryStatus, StatusVariant } from "@/schema/models/EntryStatus";

export const STATUSES: EntryStatus[] = [
    {
        kind: 'zisk:status',
        key: StatusVariant.enum.APPROXIMATE,
        label: 'Flagged',
        description: 'This entry has been flagged for review',
        disabled: false,
        archived: false,
    },
    // { // Disabled
    //     kind: 'zisk:status',
    //     key: 'NEEDS_REVIEW',
    //     label: 'Needs Review',
    //     disabled: true,
    //     description: 'This entry needs to be reviewed',
    // },
    // { // Disabled
    //     kind: 'zisk:status',
    //     key: 'WAS_REVIEWED',
    //     label: 'Reviewed',
    //     disabled: true,
    //     description: 'This entry has been reviewed',
    // },
    // {
    //     kind: 'zisk:status',
    //     key: 'APPROXIMATE',
    //     label: 'Approximate',
    //     description: 'Amounts are only rough estimates'
    // },
    // {
    //     kind: 'zisk:status',
    //     key: 'PENDING',
    //     label: 'Pending',
    //     description: 'Entry is pending'
    // },
]


export const RESERVED_TAGS: Record<ReservedTagKey, ReservedTag> = {
    
}
