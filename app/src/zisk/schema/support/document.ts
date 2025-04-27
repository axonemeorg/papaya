import { z } from 'zod'
import { _Model, Kind } from './model'

const IdentifierMetadata = z.object({
	_id: z.string(),
})
type IdentifierMetadata = z.output<typeof IdentifierMetadata>

const AttachmentMeta = z.object({
	content_type: z.string(),
	data: z.instanceof(File),
})
type AttachmentMeta = z.output<typeof AttachmentMeta>

const _Document = _Model
    .extend(IdentifierMetadata)
    .extend(
        z.object({
            _rev: z.string().optional(),
            _deleted: z.boolean().optional(),
            _attachments: z.record(z.string(), AttachmentMeta).optional(),
        })
    )
type _Document = z.output<typeof _Document>

export class DocumentSchema {
    static new<
        KindValue extends Kind,
        Fields extends z.ZodRawShape,
        MetaFields extends z.ZodRawShape
    >(
        base: { kind: z.ZodLiteral<KindValue> },
        fields: Fields,
        metaFields: MetaFields
    ) {
        const CreateSchema = _Model.extend({
            kind: base.kind,
            ...fields,
        });

        const FullSchema = _Document.extend({
            kind: base.kind,
            ...fields,
            ...metaFields,
        });

        return [CreateSchema, FullSchema] as const;
    }
}
