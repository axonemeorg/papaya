import { z, ZodRawShape } from 'zod'

class NaturalMixin {
    public static _ephemeral(_ephemeral: ZodRawShape) {
        return z.interface({
            _ephemeral: z.interface(_ephemeral),
        })
    }

    public static _derived(_derived: ZodRawShape) {
        return z.interface({
            _derived: z.interface(_derived),
        })
    }

    private static _id() {
        return z.interface ({
            _id: z.string(),
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
            'updatedAt?': z.string().nullable().optional(),
        })
    }

    public static natural = {
        _derived: NaturalMixin._derived,
        // _id: NaturalMixin._id,
    }
}

export class Mixin {
    static intrinsic = IntrinsicMixin
    static derived = DerivedMixin
}
