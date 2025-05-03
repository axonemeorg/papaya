import { z, ZodRawShape } from 'zod'

class NaturalMixin {
    public static _ephemeral(_ephemeral: ZodRawShape) {
        return z.interface({
            _ephemeral,
        })
    }

    public static _derived(_derived: ZodRawShape) {
        return z.interface({
            _derived,
        })
    }
}

class IntrinsicMixin {
    public static belongsToJournal() {
        return z.interface({
            journalId: z.string(),
        })
    }

    public static natural = {
        _ephemeral: NaturalMixin._ephemeral
    }
}

class DerivedMixin {
    public static timestamps() {
        return z.interface({
            createdAt: z.string(),
            updatedAt: z.string().nullable().optional(),
        })
    }

    public static natural = {
        _derived: NaturalMixin._derived
    }
}

export class Mixin {
    static intrinsic = IntrinsicMixin
    static derived = DerivedMixin
}
