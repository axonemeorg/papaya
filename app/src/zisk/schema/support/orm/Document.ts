import { z } from 'zod'
import { _Model, Kind } from '@/schema/support/orm/Model'

export const IdentifierMetadata = z.interface({
	_id: z.string(),
})
export type IdentifierMetadata = z.output<typeof IdentifierMetadata>

const AttachmentMeta = z.interface({
	content_type: z.string(),
	data: z.instanceof(File),
})
type AttachmentMeta = z.output<typeof AttachmentMeta>

export const _Document = IdentifierMetadata
    .extend(
        z.interface({
            '_rev?': z.string().optional(),
            '_deleted?': z.boolean().optional(),
            '_attachments?': z.record(z.string(), AttachmentMeta).optional(),
        })
    )
export type _Document = z.output<typeof _Document>

export class DocumentSchema {
    static new<
        KindValue extends Kind,
        IntrinsicInterface extends z.ZodInterface,
        DerivedInterface extends z.ZodInterface
    >(
        modelAttrs: {
            kind: z.ZodLiteral<KindValue>,
        },
        intriniscInterface: IntrinsicInterface,
        derivedInterface: DerivedInterface
    ) {
        const { kind } = modelAttrs;
        
        const CreateSchema = _Document.partial()
            .extend(intriniscInterface)
            
        const FullIntrinsicSchema = _Model
            .extend(_Document)
            .extend({
                kind,
            })
            .extend(intriniscInterface)
            .extend(derivedInterface)
                    
        // const FullDerivedSchema = derivedInterface
        //     ? FullIntrinsicSchema.extend(derivedInterface)
        //     : FullIntrinsicSchema

        const FullDerivedSchema = FullIntrinsicSchema

        return [CreateSchema, FullDerivedSchema] as const;
    }
}

const x = z.interface({
    name: z.string()
})

type X = typeof x