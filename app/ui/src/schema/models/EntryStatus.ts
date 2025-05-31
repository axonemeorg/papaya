import { Mixin } from '@ui/schema/support/orm/Mixin'
import { Model } from '@ui/schema/support/orm/Model'
import { z } from 'zod/v4'

// TODO no idea why but this has to be marked as exported else you get a buidl error
export enum Status {
  FLAGGED = 'zisk.status.flagged',
  NEEDS_REVIEW = 'zisk.status.needsreview',
  WAS_REVIEWED = 'zisk.status.wasreview',
  APPROXIMATE = 'zisk.status.approximate',
  PENDING = 'zisk.status.pending',
}

export const StatusVariant = z.enum(Status)

export type StatusVariant = z.output<typeof StatusVariant>

export const [CreateEntryStatus, EntryStatus] = Model.fromSchema({
  kind: z.literal('zisk:status'),
  ...Mixin.derived.natural._id(),
  label: z.string(),
  description: z.string(),
  archived: z.boolean(),
})

export type CreateEntryStatus = z.output<typeof CreateEntryStatus>
export type EntryStatus = z.output<typeof EntryStatus>
