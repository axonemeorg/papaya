import { BaseJournalEntry, ZiskDocument } from "@/types/schema";


export const flattenJournalObjects = (journalObjects: ZiskDocument[]): ZiskDocument[] => {
    const flattenedObjects: ZiskDocument[] = []

    journalObjects.forEach((object) => {
        flattenedObjects.push(object)

        if (object.kind === 'JOURNAL_ENTRY' && object.children) {
            object.children.forEach((entry: BaseJournalEntry) => {
                flattenedObjects.push({
                    ...entry,
                    kind: 'CHILD_JOURNAL_ENTRY',
                    parentEntry: object,
                })
            })
        }
    })

    return flattenedObjects
}
