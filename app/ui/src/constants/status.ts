import { EntryStatus, StatusVariant } from '@ui/schema/models/EntryStatus'

export const ZiskEntryStatus: EntryStatus[] = [
  {
    _id: StatusVariant.enum.FLAGGED,
    kind: 'zisk:status',
    label: 'Flagged',
    description: 'This entry has been flagged for review',
    archived: false,
  },
  {
    _id: StatusVariant.enum.NEEDS_REVIEW,
    kind: 'zisk:status',
    label: 'Needs Review',
    description: 'This entry needs to be reviewed',
    archived: true,
  },
  {
    _id: StatusVariant.enum.WAS_REVIEWED,
    kind: 'zisk:status',
    label: 'Reviewed',
    description: 'This entry has been reviewed',
    archived: true,
  },
  {
    _id: StatusVariant.enum.APPROXIMATE,
    kind: 'zisk:status',
    label: 'Approximate',
    description: 'Amounts are only rough estimates',
    archived: false,
  },
  {
    _id: StatusVariant.enum.PENDING,
    kind: 'zisk:status',
    label: 'Pending',
    description: 'Entry is pending',
    archived: false,
  },
]
