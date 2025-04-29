import z from "zod";

export const Kind = z.templateLiteral(['zisk:', z.string()])
export type Kind = z.output<typeof Kind>

export const _Model = z.interface({
    kind: Kind,
    '_version?': z.union([z.string(), z.number()]),
    '_derived?': z.object(),
    '_ephemeral?': z.object(),
})
export type _Model = z.output<typeof _Model>

export class ModelSchema {
    static from<KindValue extends Kind, Interface extends z.ZodInterface>(
        base: { kind: z.ZodLiteral<KindValue> },
        inter: Interface
    ) {
        return _Model
            .extend({
                kind: base.kind,
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
