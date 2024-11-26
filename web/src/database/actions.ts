import { Category, CreateCategory, CreateJournalEntry, type CreateJournalEntryForm, CreateQuickJournalEntry, EditJournalEntryForm, EnhancedJournalEntry, type JournalEntry } from "@/types/schema";
import { db, ZISK_JOURNAL_META_KEY, ZiskJournalMeta } from "./client";
import { generateCategoryId, generateJournalEntryId } from "@/utils/id";
import { getJournalEntryChildren } from "./queries";
import { isCreateJournalEntryForm, isEditJournalEntryForm } from "@/utils/journal";

export const createOrUpdateJournalEntry = async (formData: CreateJournalEntryForm | EditJournalEntryForm) => {
    const now = new Date().toISOString();

    const meta = await db.get(ZISK_JOURNAL_META_KEY) as ZiskJournalMeta;
    const { journalEntrySequence } = meta;

    function* makeSequenceGenerator(initialValue: number): Generator<number> {
        for (let i = initialValue; ; i++) {
            yield i;
        }
    }

    const sequenceGenerator = makeSequenceGenerator(journalEntrySequence);
    const parentDate = formData.parent.date;

    const editingChildrenIds = new Set<string>(
        formData.children.map(child => (child as JournalEntry)._id).filter(Boolean)
    );

    const deletedChildren: JournalEntry[] = [];

    let parent: JournalEntry;

    let parentId: string;
    let parentSequenceNumber: number | undefined | null;

    const isEditing = '_id' in formData.parent && Boolean(formData.parent._id);

    if (isEditing) {
        parentId = (formData.parent as JournalEntry)._id;
        parentSequenceNumber = (formData.parent as JournalEntry).sequenceNumber;
    } else {
        parentId = generateJournalEntryId();
        parentSequenceNumber = sequenceGenerator.next().value;
    }

    // Check if form data is for editing. If so, we need to check for children to delete
    if (isEditing) {
        const currentChildren = await getJournalEntryChildren(parentId);
        currentChildren.forEach((child) => {
            if (!editingChildrenIds.has(child._id)) {
                deletedChildren.push({
                    ...child,
                    _deleted: true,
                });
            }
        });
    }

    const children: JournalEntry[] = formData.children.map((child) => {
        if ('_id' in child) {
            // Child entry was edited
            return {
                ...child,
                date: parentDate,
                updatedAt: now,
            }
        } else {
            // New child entry
            return {
                ...child,
                _id: generateJournalEntryId(),
                type: 'JOURNAL_ENTRY',
                date: parentDate,
                sequenceNumber: sequenceGenerator.next().value,
                parentEntryId: parentId,
                createdAt: now,
                updatedAt: null,
            }
        }
    });

    if ('_id' in formData.parent) {
        // Updating
        parent = {
            ...formData.parent,
            childEntryIds: children.map(child => child._id),
            updatedAt: now,
        };
    } else {
        parent = {
            ...formData.parent,
            _id: parentId,
            type: 'JOURNAL_ENTRY',
            sequenceNumber: parentSequenceNumber,
            childEntryIds: children.map(child => child._id),
            createdAt: now,
            updatedAt: null,
        };
    }

    const docs: Object[] = [
        parent,
        ...children,
        ...deletedChildren,
        {
            ...meta,
            journalEntrySequence: journalEntrySequence + children.length + 1,
        }
    ];

    console.log('createOrUpdateJournalEntry.docs', docs);

    return db.bulkDocs(docs);
}

export const createQuickJournalEntry = async (formData: CreateQuickJournalEntry, date: string) => {
    const journalEntryFormData: CreateJournalEntryForm = {
        parent: {
            memo: formData.memo,
            amount: formData.amount,
            date,
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

    return createOrUpdateJournalEntry(journalEntryFormData);
}

// export const updateJournalEntry = async (formData: EditJournalEntryForm) => {
//     const now = new Date().toISOString();
    
//     const parentDate = formData.parent.date;
//     const currentChildren = await getJournalEntryChildren(formData.parent._id);
//     const newChildren: Record<JournalEntry['_id'], JournalEntry> = formData.children.reduce(
//         (acc: Record<JournalEntry['_id'], JournalEntry>, child) => {
//             acc[child._id] = child;
//             return acc;
//         },
//         {}
//     );

//     const children: JournalEntry[] = currentChildren.map(child => {
//         if (!newChildren[child._id]) {
//             // Child entry was deleted
//             return {
//                 ...child,
//                 _deleted: true,
//             }
//         }

//         return {
//             ...child,
//             ...newChildren[child._id],
//             date: parentDate, // Keep date in sync with parent
//             updatedAt: now,
//         }
//     });

//     const parent: JournalEntry = {
//         ...formData.parent,
//         updatedAt: now,
//         childEntryIds: Object.keys(newChildren),
//     };

//     return db.bulkDocs([parent, ...children]);
// }

export const deleteJournalEntry = async (journalEntryId: string): Promise<JournalEntry> => {
    const record = await db.get(journalEntryId);
    const children = await getJournalEntryChildren(journalEntryId);
    const docs = [
        { ...record, _deleted: true },
        ...children.map(child => ({ ...child, _deleted: true })),
    ];
    await db.bulkDocs(docs);
    return record as JournalEntry;
}

export const undeleteJournalEntry = async (journalEntry: JournalEntry) => {
    await db.put(journalEntry);
}

export const createCategory = async (formData: CreateCategory) => {
    const category: Category = {
        ...formData,
        type: 'CATEGORY',
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
