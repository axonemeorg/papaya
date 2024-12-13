import { ReservedTag, ReservedTagKey } from "@/types/schema";

export const RESERVED_TAGS: Record<ReservedTagKey, ReservedTag> = {
    'FLAGGED': {
        type: 'RESERVED_TAG',
        value: 'FLAGGED',
        label: 'Flagged',
    },
    'NEEDS_REVIEW': {
        type: 'RESERVED_TAG',
        value: 'NEEDS_REVIEW',
        label: 'Needs Review',
    },
    'WAS_REVIEWED': {
        type: 'RESERVED_TAG',
        value: 'WAS_REVIEWED',
        label: 'Reviewed',
    },
}
