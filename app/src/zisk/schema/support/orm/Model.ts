import z from "zod";

export const Kind = z.templateLiteral(['zisk:', z.string()])
export type Kind = z.output<typeof Kind>

export const _Model = z.object({
    kind: Kind,
})
export type _Model = z.output<typeof _Model>

export class ModelSchema {
    static from<
        KindValue extends Kind,
        Intrinsic extends z.ZodRawShape
    >(
        modelAttrs: {
            kind: z.ZodLiteral<KindValue>,
        },
        intrinisc: Intrinsic
    ): z.ZodObject<KindValue & Intrinsic> {
        const { kind } = modelAttrs;
        
        return _Model
            .extend({
                kind,
            })
            .extend(intrinisc)
    }
}
