import {
	Category,
	CreateCategory,
	CreateJournalMeta,
	JournalEntry,
	JournalMeta,
} from '@/types/schema'
import { getDatabaseClient } from './client'
import { generateCategoryId, generateJournalId } from '@/utils/id'
import { getJournalEntryChildren, getOrCreateZiskMeta } from './queries'

const db = getDatabaseClient()

export const putJournalEntry = async (formData: JournalEntry) => {
	const now = new Date().toISOString()

	const parentDate = formData.date
	const parentId: string = formData._id

	// Update children to sync date with parent
	const currentChildren = await getJournalEntryChildren(parentId)
	const updateChildren: JournalEntry[] = currentChildren.map((child) => {
		return {
			...child,
			date: parentDate,
		}
	})

	const docs: object[] = [
		{
			...formData,
			updatedAt: now,
		},
		...updateChildren,
	]

	return db.bulkDocs(docs)
}

export const deleteJournalEntry = async (journalEntryId: string): Promise<JournalEntry> => {
	const record = await db.get(journalEntryId)
	const children = await getJournalEntryChildren(journalEntryId)
	const docs = [{ ...record, _deleted: true }, ...children.map((child) => ({ ...child, _deleted: true }))]
	await db.bulkDocs(docs)
	return record as JournalEntry
}

export const undeleteJournalEntry = async (journalEntry: JournalEntry) => {
	await db.put(journalEntry)
}

export const createCategory = async (formData: CreateCategory, journalId: string) => {
	const category: Category = {
		...formData,
		type: 'CATEGORY',
		_id: generateCategoryId(),
		createdAt: new Date().toISOString(),
		updatedAt: null,
		journalId,
	}

	return db.put(category)
}

export const updateCategory = async (formData: Category) => {
	return db.put({
		...formData,
		updatedAt: new Date().toISOString(),
	})
}

export const deleteCategory = async (categoryId: string): Promise<Category> => {
	const record = await db.get(categoryId)
	await db.remove(record)
	return record as Category
}

export const undeleteCategory = async (category: Category) => {
	await db.put(category)
}

export const createJournal = async (journal: CreateJournalMeta): Promise<JournalMeta> => {
	const newJournal: JournalMeta = {
		...journal,
		type: 'JOURNAL',
		journalVersion: 1,
		_id: generateJournalId(),
		createdAt: new Date().toISOString(),
		updatedAt: null,
	}

	await db.put(newJournal)

	return newJournal
}

export const updateActiveJournal = async (journalId: string) => {
	const meta = await getOrCreateZiskMeta()
	await db.put({
		...meta,
		activeJournalId: journalId,
	})
}
