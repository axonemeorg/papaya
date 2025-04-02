import { ReservedTag, ReservedTagKey } from "@/types/schema";

export const RESERVED_TAGS: Record<ReservedTagKey, ReservedTag> = {
    'FLAGGED': {
        type: 'RESERVED_TAG',
        _id: 'FLAGGED',
        label: 'Flagged',
        description: 'This entry has been flagged for review',
    },
    'NEEDS_REVIEW': { // Disabled
        type: 'RESERVED_TAG',
        _id: 'NEEDS_REVIEW',
        label: 'Needs Review',
        disabled: true,
        description: 'This entry needs to be reviewed',
    },
    'WAS_REVIEWED': { // Disabled
        type: 'RESERVED_TAG',
        _id: 'WAS_REVIEWED',
        label: 'Reviewed',
        disabled: true,
        description: 'This entry has been reviewed',
    },
    'APPROXIMATE': {
        type: 'RESERVED_TAG',
        _id: 'APPROXIMATE',
        label: 'Approximate',
        description: 'Amounts are only rough estimates'
    },
    'PENDING': {
        type: 'RESERVED_TAG',
        _id: 'PENDING',
        label: 'Pending',
        description: 'Entry amount'
    },
}
