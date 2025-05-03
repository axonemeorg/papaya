import z from "zod";

export const Kind = z.templateLiteral(['zisk:', z.string()])
export type Kind = z.output<typeof Kind>

export const _Model = z.interface({
    kind: Kind,
    '_version?': z.union([z.string(), z.number()]),
    '_derived?': z.object(),
    '_ephemeral?': z.object().optional(),
})
export type _Model = z.output<typeof _Model>

const createVersionSchema = () => z.union([z.string(), z.number()]).optional();
const createDerivedSchema = (schema = {}) => z.object(schema).optional();
const createEphemeralSchema = (schema = {}) => z.object(schema).optional();

export class ModelSchema {
    static from<
        KindValue extends Kind,
        Interface extends z.ZodInterface
    >(
        modelAttrs: {
            kind: z.ZodLiteral<KindValue>,
            _version?: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>,
            _derived?: z.ZodOptional<z.ZodObject<any>>,
            _ephemeral?: z.ZodOptional<z.ZodObject<any>>
        },
        inter: Interface
    ) {
        const { kind, _version, _derived, _ephemeral } = modelAttrs;
        
        return _Model
            .extend({
                kind,
                '_version?': _version || createVersionSchema(),
                '_derived?': _derived || createDerivedSchema(),
                '_ephemeral?': _ephemeral || createEphemeralSchema()
            })
            .extend(inter)
    }
}
