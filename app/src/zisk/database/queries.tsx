import {
	Account,
	Category,
	EntryArtifact,
	EntryTag,
	JournalEntry,
	JournalMeta,
	JournalSlice,
	ZiskMeta,
} from '@/types/schema'
import { getDatabaseClient } from './client'
import { makeDefaultZiskMeta } from '@/utils/database'
import { getAbsoluteDateRangeFromDateView } from '@/utils/date'

const db = getDatabaseClient()

const ARBITRARY_MAX_FIND_LIMIT = 10000 as const;

export const getCategories = async (journalId: string): Promise<Record<Category['_id'], Category>> => {
	const result = await db.find({
		selector: {
			'$and': [
				{ type: 'CATEGORY' },
				{ journalId },
			],
		},
		limit: ARBITRARY_MAX_FIND_LIMIT,
	})

	return Object.fromEntries((result.docs as Category[]).map((category) => [category._id, category]))
}

export const getAccounts = async (journalId: string): Promise<Record<Account['_id'], Account>> => {
	const result = await db.find({
		selector: {
			'$and': [
				{ type: 'ACCOUNT' },
				{ journalId },
			],
		},
		limit: ARBITRARY_MAX_FIND_LIMIT,
	})

	return Object.fromEntries((result.docs as Account[]).map((account) => [account._id, account]))
}

export const getJournalEntries = async (
	journalSlice: JournalSlice,
	journalId: string
): Promise<Record<JournalEntry['_id'], JournalEntry>> => {
	const selectorClauses: any[] = [
		{ type: 'JOURNAL_ENTRY' },
		{ journalId },
	]
	
	// Date Range
	const { startDate, endDate } = getAbsoluteDateRangeFromDateView(journalSlice.dateView)
	if (startDate || endDate) {
		selectorClauses.push({
			date: {
				$gte: startDate?.format('YYYY-MM-DD'),
				$lte: endDate?.format('YYYY-MM-DD'),
			}
		});
	}

	// Categories
	if (journalSlice.categoryIds) {
		selectorClauses.push({
			categoryIds: {
				$in: journalSlice.categoryIds
			}
		})
	}

	const selector = {
		'$and': selectorClauses,
	}

	const result = await db.find({
		selector,
		limit: ARBITRARY_MAX_FIND_LIMIT,
	})

	return Object.fromEntries((result.docs as JournalEntry[]).map((entry) => [entry._id, entry]))
}

export const getEntryTags = async (journalId: string): Promise<Record<EntryTag['_id'], EntryTag>> => {
	const result = await db.find({
		selector: {
			'$and': [
				{ type: 'ENTRY_TAG' },
				{ journalId },
			],
		},
		limit: ARBITRARY_MAX_FIND_LIMIT,
	})

	return Object.fromEntries((result.docs as EntryTag[]).map((tag) => [tag._id, tag]))
}

export const getOrCreateZiskMeta = async (): Promise<ZiskMeta> => {
	// Attempt to fetch the meta document by its key
	const results = await db.find({
		selector: {
			type: 'ZISK_META',
		},
	})
	if (results.docs.length > 0) {
		return results.docs[0] as unknown as ZiskMeta
	}

	const meta: ZiskMeta = { ...makeDefaultZiskMeta() }
	await db.put(meta)
	return meta
}

export const getJournals = async (): Promise<Record<JournalMeta['_id'], JournalMeta>> => {
	const result = await db.find({
		selector: {
			type: 'JOURNAL',
		},
		limit: ARBITRARY_MAX_FIND_LIMIT,
	})

	return Object.fromEntries((result.docs as unknown as JournalMeta[]).map((journal) => [journal._id, journal]))
}

export const getArtifacts = async (journalId: string): Promise<Record<EntryArtifact['_id'], EntryArtifact>> => {
	const result = await db.find({
		selector: {
			'$and': [
				{ type: 'ENTRY_ARTIFACT' },
				{ journalId },
			],
		},
		limit: ARBITRARY_MAX_FIND_LIMIT,
	})

	return Object.fromEntries((result.docs as EntryArtifact[]).map((artifact) => [artifact._id, artifact]))
}

export const getJournalEntryWithAttachments = async (journalEntryId: string): Promise<JournalEntry> => {
	const entry = await db.get(journalEntryId, { attachments: true, binary: true }) as JournalEntry
	return entry
}
