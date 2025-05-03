import z from "zod";

export const Kind = z.templateLiteral(['zisk:', z.string()])
export type Kind = z.output<typeof Kind>

export const _Model = z.interface({
    kind: Kind,
})
export type _Model = z.output<typeof _Model>

export class ModelSchema {
    static from<
        KindValue extends Kind,
        Interface extends z.ZodInterface
    >(
        modelAttrs: {
            kind: z.ZodLiteral<KindValue>,
        },
        inter: Interface
    ) {
        const { kind } = modelAttrs;
        
        return _Model
            .extend({
                kind,
            })
            .extend(inter)
    }
}
