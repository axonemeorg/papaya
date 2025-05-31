import { Mixin } from '@ui/schema/support/orm/Mixin'
import { Model } from '@ui/schema/support/orm/Model'
import { z } from 'zod/v4'

export const AttachmentMeta = z.object({
  content_type: z.string(),
  data: z.instanceof(File),
})
export type AttachmentMeta = z.output<typeof AttachmentMeta>

const DocumentShape = {
  ...Mixin.derived.natural._id(),
  _rev: z.string().optional(),
  _deleted: z.boolean().optional(),
  _attachments: z.record(z.string(), AttachmentMeta).optional(),
}
type DocumentShape = typeof DocumentShape

const DocumentObject = z.object(DocumentShape)
export type DocumentObject = z.infer<typeof DocumentObject>

export const Document = Model.extend(DocumentShape)
