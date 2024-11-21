import { CreateJournalEntry, CreateQuickJournalEntry } from "@/types/schema";
import { db } from "./client";
import { generateJournalEntryId } from "@/utils/Utils";


export const createJournalEntry = async (formData: CreateJournalEntry) => {
    const parent = {
        ...formData.parent,
        _id: generateJournalEntryId(),
        parent: null,
    };

    const children = formData.children.map(child => {
        return {
            ...child,
            date: parent.date,
            parent: parent._id,
            _id: generateJournalEntryId(),
        }
    });
    
    return db.bulkDocs([parent, ...children]);
}

export const createQuickJournalEntry = async (formData: CreateQuickJournalEntry) => {
    const journalEntryFormData: CreateJournalEntry = {
        parent: {
            _id: '',
            type: 'JOURNAL_ENTRY',
            memo: formData.memo,
            amount: formData.amount,
            date: new Date().toISOString(),
            parentEntryId: null,
            paymentMethodId: null,
            relatedEntryIds: [],
            categoryIds: [],
            tagIds: [],
            attachmentIds: [],
            notes: '',
            entryType: 'CREDIT',
        },
        children: [],
    };

    return createJournalEntry(journalEntryFormData);
}
