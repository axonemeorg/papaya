import { z } from 'zod/v4'
import { Mixin } from '../support/orm/Mixin'
import { Model } from '../support/orm/Model'

export const [CreateEntryTask, EntryTask] = Model.fromSchemas([
  {
    kind: z.literal('zisk:task'),
    memo: z.string(),
    completedAt: z.string().nullable(),
  },
  {
    ...Mixin.derived.natural._id(),
  },
])

export type CreateEntryTask = z.output<typeof CreateEntryTask>
export type EntryTask = z.output<typeof EntryTask>
