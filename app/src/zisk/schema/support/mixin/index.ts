import { z } from 'zod'


class IntrinsicMixin {
    public static belongsToJournal() {
        return {
            journalId: z.string(),
        } as const
    }
}

class DerivedMixin {
    public static timestamps() {
        return {
            createdAt: z.string(),
            updatedAt: z.string().nullable().optional(),
        } as const
    }
}

export class Mixin {
    static intrinsic = IntrinsicMixin
    static derived = DerivedMixin
}
