import z from 'zod'
import { Model } from '@/schema/support/orm/Model'
import { Mixin } from '@/schema/support/orm/Mixin'

enum Status {
  FLAGGED = 'papaya.status.flagged',
  NEEDS_REVIEW = 'papaya.status.needsreview',
  WAS_REVIEWED = 'papaya.status.wasreview',
  APPROXIMATE = 'papaya.status.approximate',
  PENDING = 'papaya.status.pending',
}

export const StatusVariant = z.enum(Status)

export type StatusVariant = z.output<typeof StatusVariant>

export const [CreateEntryStatus, EntryStatus] = Model.fromSchema({
  kind: z.literal('papaya:status'),
  ...Mixin.derived.natural._id(),
  label: z.string(),
  description: z.string(),
  archived: z.boolean(),
})

export type CreateEntryStatus = z.output<typeof CreateEntryStatus>
export type EntryStatus = z.output<typeof EntryStatus>
