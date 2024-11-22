import { Category, CreateJournalEntry, type CreateJournalEntryForm, CreateQuickJournalEntry, EnhancedJournalEntry, type JournalEntry } from "@/types/schema";
import { db } from "./client";
import { generateCategoryId, generateJournalEntryId } from "@/utils/id";

export const createJournalEntry = async (formData: CreateJournalEntryForm) => {
    const parentId = generateJournalEntryId();

    const children: JournalEntry[] = formData.children.map(child => {
        return {
            ...child,
            type: 'JOURNAL_ENTRY',
            date: parent.date,
            parentEntryId: parent._id,
            _id: generateJournalEntryId(),
            childEntryIds: [],
        }
    });
    
    const parent: JournalEntry = {
        ...formData.parent,
        type: 'JOURNAL_ENTRY',
        _id: parentId,
        parentEntryId: null,
        childEntryIds: children.map(child => child._id),
    };

    return db.bulkDocs([parent, ...children]);
}

export const createQuickJournalEntry = async (formData: CreateQuickJournalEntry) => {
    const journalEntryFormData: CreateJournalEntryForm = {
        parent: {
            memo: formData.memo,
            amount: formData.amount,
            date: new Date().toISOString(),
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

export const deleteJournalEntry = async (entry: EnhancedJournalEntry | JournalEntry) => {
    const record = await db.get(entry._id);
    return db.remove(record);
}

export const createCategory = async (formData: Category) => {
    const category = {
        ...formData,
        _id: generateCategoryId(),
    };

    return db.put(category);
}

export const updateCategory = async (formData: Category) => {
    return db.put(formData);
}

export const deleteCategory = async (formData: Category) => {
    const record = await db.get(formData._id);
    return db.remove(record);
}

export const undeleteCategory = async (formData: Category) => {
    const record = await db.get(formData._id);
    return db.put({
        ...record,
        _deleted: false,
    });
}
