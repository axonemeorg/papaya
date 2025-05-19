import { z } from 'zod'

class NaturalMixin {
    public static $ephemeral<E extends z.ZodRawShape>($ephemeral: E) {
        return {
            $ephemeral: z.object($ephemeral),
        }
    }

    public static $derived<D extends z.ZodRawShape>($derived: D) {
        return {
            $derived: z.object($derived),
        }
    }

    public static _id() {
        return {
            _id: z.string(),
        }
    }
}

class IntrinsicMixin {
    public static natural = {
        $ephemeral: NaturalMixin.$ephemeral
    }
}

class DerivedMixin {
    public static timestamps() {
        return {
            createdAt: z.string(),
            'updatedAt': z.string().nullable().optional(),
        }
    }

    public static belongsToJournal() {
        return {
            journalId: z.string(),
        }
    }

    public static natural = {
        $derived: NaturalMixin.$derived,
        _id: NaturalMixin._id,
    }
}

export class Mixin {
    static intrinsic = IntrinsicMixin
    static derived = DerivedMixin
}
