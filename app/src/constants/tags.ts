import { ReservedTag, ReservedTagKey } from "@/types/schema";

export const RESERVED_TAGS: Record<ReservedTagKey, ReservedTag> = {
    'FLAGGED': {
        type: 'RESERVED_TAG',
        _id: 'FLAGGED',
        label: 'Flagged',
        description: 'This entry has been flagged for review',
    },
    'NEEDS_REVIEW': {
        type: 'RESERVED_TAG',
        _id: 'NEEDS_REVIEW',
        label: 'Needs Review',
        description: 'This entry needs to be reviewed',
    },
    'WAS_REVIEWED': {
        type: 'RESERVED_TAG',
        _id: 'WAS_REVIEWED',
        label: 'Reviewed',
        description: 'This entry has been reviewed',
    },
}
