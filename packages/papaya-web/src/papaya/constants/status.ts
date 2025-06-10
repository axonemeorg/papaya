import { EntryStatus, StatusVariant } from '@/schema/models/EntryStatus'

export const PapayaEntryStatus: EntryStatus[] = [
  {
    _id: StatusVariant.enum.FLAGGED,
    kind: 'papaya:status',
    label: 'Flagged',
    description: 'This entry has been flagged for review',
    archived: false,
  },
  {
    _id: StatusVariant.enum.NEEDS_REVIEW,
    kind: 'papaya:status',
    label: 'Needs Review',
    description: 'This entry needs to be reviewed',
    archived: true,
  },
  {
    _id: StatusVariant.enum.WAS_REVIEWED,
    kind: 'papaya:status',
    label: 'Reviewed',
    description: 'This entry has been reviewed',
    archived: true,
  },
  {
    _id: StatusVariant.enum.APPROXIMATE,
    kind: 'papaya:status',
    label: 'Approximate',
    description: 'Amounts are only rough estimates',
    archived: false,
  },
  {
    _id: StatusVariant.enum.PENDING,
    kind: 'papaya:status',
    label: 'Pending',
    description: 'Entry is pending',
    archived: false,
  },
]
