import z from 'zod'
import { Model } from '../support/orm/Model'

export const [CreatePapayaServer, PapayaServer] = Model.fromSchemas([
  {
    kind: z.literal('papaya:server'),
    displayName: z.string(),
    url: z.string(),
  },
  {
    // ...Mixin.derived.natural._id(
    //   z.templateLiteral([
    //     z.literal('papaya:server:'),
    //     z.url(),
    //   ])
    // ),
    managedBy: z.literal(null),
  },
])

export type CreatePapayaServer = z.output<typeof CreatePapayaServer>
export type PapayaServer = z.output<typeof PapayaServer>
