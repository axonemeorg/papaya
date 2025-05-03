import { z } from 'zod'
import { _Model, Kind } from '@/schema/support/model'

// Helper functions for creating schema components
const createVersionSchema = () => z.union([z.string(), z.number()]).optional();
const createDerivedSchema = (schema = {}) => z.object(schema).optional();
const createEphemeralSchema = (schema = {}) => z.object(schema).optional();

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
        z.interface({
            _rev: z.string().optional(),
            _deleted: z.boolean().optional(),
            _attachments: z.record(z.string(), AttachmentMeta).optional(),
        })
    )
type _Document = z.output<typeof _Document>

export class DocumentSchema {
    static new<
        KindValue extends Kind,
        IntrinsicInterface extends z.ZodInterface,
        DerivedInterface extends z.ZodInterface
    >(
        modelAttrs: {
            kind: z.ZodLiteral<KindValue>,
            _version?: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>,
            _derived?: z.ZodOptional<z.ZodInterface<any>>,
            _ephemeral?: z.ZodOptional<z.ZodInterface<any>>
        },
        intriniscInterface: IntrinsicInterface,
        derivedInterface: DerivedInterface
    ) {
        const { kind, _version, _derived, _ephemeral } = modelAttrs;
        
        const CreateSchema = _Model
            .extend({
                kind,
                '_version?': _version || createVersionSchema(),
                '_derived?': _derived || createDerivedSchema(),
                '_ephemeral?': _ephemeral || createEphemeralSchema()
            })
            .extend(intriniscInterface)

        const FullSchema = _Document
            .extend({
                kind,
                '_version?': _version || createVersionSchema(),
                '_derived?': _derived || createDerivedSchema(),
                '_ephemeral?': _ephemeral || createEphemeralSchema()
            })
            .extend(intriniscInterface)
            .extend(derivedInterface)

        return [CreateSchema, FullSchema] as const;
    }
}
