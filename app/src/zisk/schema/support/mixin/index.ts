import { z } from 'zod'


class IntrinsicMixin {
    public static belongsToJournal() {
        return {
            journalId: z.string(),
        } as const
    }
}

class DerivedMixin {

}

export class Mixin {
    static intrinsic = IntrinsicMixin
    static derived = DerivedMixin
}
