import z from 'zod'
import { Mixin } from '../support/orm/Mixin'
import { Model } from '../support/orm/Model'

export const [CreateZiskServer, ZiskServer] = Model.fromSchemas([
  {
    kind: z.literal('zisk:server'),
    displayName: z.string(),
    url: z.string(),
    connection: z.object({
      username: z.string(),
    })
      .optional()
      .nullable(),
  },
  {
    ...Mixin.derived.natural._id(),
    managedBy: z.literal(null),
  },
])

export type CreateZiskServer = z.output<typeof CreateZiskServer>
export type ZiskServer = z.output<typeof ZiskServer>
