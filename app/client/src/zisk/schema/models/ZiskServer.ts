import z from 'zod'
import { Model } from '../support/orm/Model'

export const [CreateZiskServer, ZiskServer] = Model.fromSchemas([
  {
    kind: z.literal('zisk:server'),
    displayName: z.string(),
    url: z.string(),
  },
  {
    // ...Mixin.derived.natural._id(
    //   z.templateLiteral([
    //     z.literal('zisk:server:'),
    //     z.url(),
    //   ])
    // ),
    managedBy: z.literal(null),
  },
])

export type CreateZiskServer = z.output<typeof CreateZiskServer>
export type ZiskServer = z.output<typeof ZiskServer>
