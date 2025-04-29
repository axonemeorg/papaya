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

// Helper functions for creating schema components
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
            version?: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>,
            derived?: z.ZodOptional<z.ZodObject<any>>,
            ephemeral?: z.ZodOptional<z.ZodObject<any>>
        },
        inter: Interface
    ) {
        const { kind, version, derived, ephemeral } = modelAttrs;
        
        return _Model
            .extend({
                kind,
                '_version?': version || createVersionSchema(),
                '_derived?': derived || createDerivedSchema(),
                '_ephemeral?': ephemeral || createEphemeralSchema()
            })
            .extend(inter)
    }
}

// TODO ignore
// const db: any = {};

// class ModelFacade {
//     static fromSchemas<Intrinsic extends Array<z.ZodObject>, Derived extends Array<z.ZodObject>>(
//         intrinicSchemas: Intrinsic,
//         derivedSchemas: Derived,
//     ) {
//         const intrinsic = z.discriminatedUnion('kind', intrinicSchemas)
//         const derived = z.discriminatedUnion('kind', derivedSchemas)

//         return class ModelFacade {
//             static make(props: z.infer<typeof intrinsic>) {
//                 return {
//                     ...props
//                 }
//             }

//             static save(props: z.infer<typeof derived>) {
//                 db.put(props)
//             }
//         }
//     }
// }
