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
    static from<KindValue extends Kind, Fields extends z.ZodRawShape>(
        base: { kind: z.ZodLiteral<KindValue> },
        fields: Fields
    ) {
        return _Model.extend({
            kind: base.kind,
            ...fields,
        });
    }
}


