import { Category, CreateJournalEntry, type CreateJournalEntryForm, CreateQuickJournalEntry, EnhancedJournalEntry, type JournalEntry } from "@/types/schema";
import { db, JOURNAL_ENTRY_SEQUENCE_NUMBER_KEY } from "./client";
import { generateCategoryId, generateJournalEntryId } from "@/utils/id";

export const createJournalEntry = async (formData: CreateJournalEntryForm) => {
    let s: number | null = null;
    try {
        const sequenceDocument = (await db.get(JOURNAL_ENTRY_SEQUENCE_NUMBER_KEY) as { sequenceValue: number });
        s = sequenceDocument.sequenceValue;
    } catch (error) {
        //
    }

    console.log('s:', s)

    const parentId = generateJournalEntryId();
    const parentSequenceNumber = s === null ? null : s;

    const children: JournalEntry[] = formData.children.map((child, index) => {
        return {
            ...child,
            type: 'JOURNAL_ENTRY',
            date: parent.date,
            sequenceNumber: parentSequenceNumber === null ? null : parentSequenceNumber + index + 1,
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
        sequenceNumber: parentSequenceNumber,
        childEntryIds: children.map(child => child._id),
    };

    const docs: Object[] = [parent, ...children];

    if (s !== null) {
        docs.push({
            _id: JOURNAL_ENTRY_SEQUENCE_NUMBER_KEY,
            sequenceValue: s + children.length + 1,
        });
    }

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

export const deleteJournalEntry = async (journalEntryId: string): Promise<JournalEntry> => {
    const record = await db.get(journalEntryId);
    await db.remove(record);
    return record as JournalEntry;
}

export const undeleteJournalEntry = async (journalEntry: JournalEntry) => {
    await db.put(journalEntry);
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

export const deleteCategory = async (categoryId: string): Promise<Category> => {
    const record = await db.get(categoryId);
    await db.remove(record);
    return record as Category;
}

export const undeleteCategory = async (category: Category) => {
    await db.put(category);
}
