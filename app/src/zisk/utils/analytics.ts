import { Category, JournalEntry } from "@/types/schema"


export const calculateCategorySums = (journalEntries: JournalEntry[]): Record<string, number> => {
    return journalEntries.reduce((acc: Record<Category['_id'], number>, entry: JournalEntry) => {
        if (entry.categoryId) {

        }

        return acc
    }, {})
}
