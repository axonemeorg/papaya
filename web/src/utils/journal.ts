import { EnhancedJournalEntry, type JournalEntry } from "@/types/schema";

/**
 * Strips optional fields from a JournalEntry object
 */
export const simplifyJournalEntry = (entry: JournalEntry): JournalEntry => {
    if (!entry.attachmentIds?.length) {
        delete entry.attachmentIds;
    }
    if (!entry.tagIds?.length) {
        delete entry.tagIds;
    }
    if (!entry.relatedEntryIds?.length) {
        delete entry.relatedEntryIds;
    }
    if (!entry.categoryIds?.length) {
        delete entry.categoryIds;
    }
    if (!entry.paymentMethodId) {
        delete entry.paymentMethodId;
    }
    if (!entry.notes) {
        delete entry.notes;
    }

    return {
        ...entry
    }
}

export const enhanceJournalEntry = (parent: JournalEntry, children: JournalEntry[]): EnhancedJournalEntry => {
    const allCategoryIds = Array.from(new Set([...parent.categoryIds ?? [], ...children.flatMap(child => child.categoryIds ?? [])]));

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
