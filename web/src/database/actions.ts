import { Category, CreateCategory, CreateJournalEntry, type CreateJournalEntryForm, CreateQuickJournalEntry, EditJournalEntryForm, EnhancedJournalEntry, type JournalEntry } from "@/types/schema";
import { db, ZISK_JOURNAL_META_KEY, ZiskJournalMeta } from "./client";
import { generateCategoryId, generateJournalEntryId } from "@/utils/id";

export const createJournalEntry = async (formData: CreateJournalEntryForm) => {
    const now = new Date().toISOString();
    const meta = await db.get(ZISK_JOURNAL_META_KEY) as ZiskJournalMeta;
    const { journalEntrySequence } = meta;

    const parentId = generateJournalEntryId();
    const parentDate = formData.parent.date;
    const parentSequenceNumber = journalEntrySequence;

    const children: JournalEntry[] = formData.children.map((child, index) => {
        return {
            ...child,
            _id: generateJournalEntryId(),
            type: 'JOURNAL_ENTRY',
            date: parentDate,
            sequenceNumber: journalEntrySequence + index + 1,
            parentEntryId: parentId,
            createdAt: now,
            updatedAt: null,
        }
    });
    
    const parent: JournalEntry = {
        ...formData.parent,
        type: 'JOURNAL_ENTRY',
        _id: parentId,
        parentEntryId: null,
        sequenceNumber: parentSequenceNumber,
        childEntryIds: children.map(child => child._id),
        createdAt: now,
        updatedAt: null,
    };

    const docs: Object[] = [parent, ...children];

    docs.push({
        ...meta,
        journalEntrySequence: journalEntrySequence + children.length + 1,
    });

    return db.bulkDocs(docs);
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

export const updateJournalEntry = async (formData: EditJournalEntryForm) => {
    const now = new Date().toISOString();
    const parent: JournalEntry = {
        ...formData.parent,
        updatedAt: now,
    };

    const children: JournalEntry[] = formData.children.map(child => {
        return {
            ...child,
            updatedAt: now,
        }
    });

    return db.bulkDocs([parent, ...children]);
}

export const deleteJournalEntry = async (journalEntryId: string): Promise<JournalEntry> => {
    const record = await db.get(journalEntryId);
    await db.remove(record);
    return record as JournalEntry;
}

export const undeleteJournalEntry = async (journalEntry: JournalEntry) => {
    await db.put(journalEntry);
}

export const createCategory = async (formData: CreateCategory) => {
    const category: Category = {
        ...formData,
        _id: generateCategoryId(),
        createdAt: new Date().toISOString(),
        updatedAt: null,
    };

    return db.put(category);
}

export const updateCategory = async (formData: Category) => {
    return db.put({
        ...formData,
        updatedAt: new Date().toISOString(),
    });
}

export const deleteCategory = async (categoryId: string): Promise<Category> => {
    const record = await db.get(categoryId);
    await db.remove(record);
    return record as Category;
}

export const undeleteCategory = async (category: Category) => {
    await db.put(category);
}
