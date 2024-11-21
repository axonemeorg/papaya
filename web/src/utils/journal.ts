import { EnhancedJournalEntry, type JournalEntry } from "@/types/schema";


export const enhanceJournalEntry = (parent: JournalEntry, children: JournalEntry[]): EnhancedJournalEntry => {
    const allCategoryIds = Array.from(new Set([...parent.categoryIds, ...children.flatMap(child => child.categoryIds)]));

    const netAmount = children.reduce((acc, child) => {
        if (child.entryType === 'CREDIT') {
            return acc - parseFloat(child.amount);
        } else {
            return acc + parseFloat(child.amount);
        }
    }, parseFloat(parent.amount) * (parent.entryType === 'CREDIT' ? -1 : 1));

    return {
        ...parent,
        allCategoryIds,
        netAmount,
    }
}
