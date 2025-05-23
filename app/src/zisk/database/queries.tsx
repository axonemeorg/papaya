import { getDatabaseClient } from './client'
import { makeDefaultZiskMeta } from '@/utils/database'
import { Category } from '@/schema/documents/Category'
import { Account } from '@/schema/documents/Account'
import { JournalEntry } from '@/schema/documents/JournalEntry'
import { EntryTag } from '@/schema/documents/EntryTag'
import { ZiskMeta } from '@/schema/documents/ZiskMeta'
import { Journal } from '@/schema/documents/Journal'
import { EntryArtifact } from '@/schema/documents/EntryArtifact'
import { SearchFacets } from '@/schema/support/search/facet'
import { FacetedSearchUpstreamFilters } from '@/schema/support/search/filter'

// Type declaration for deprecated function
type JournalSlice = any;

const db = getDatabaseClient()

export const ARBITRARY_MAX_FIND_LIMIT = 10000 as const;

export const getCategories = async (journalId: string): Promise<Record<string, Category>> => {
	const result = await db.find({
		selector: {
			'$and': [
				{ kind: 'zisk:category' },
				{ journalId },
			],
		},
		limit: ARBITRARY_MAX_FIND_LIMIT,
	})

	return Object.fromEntries((result.docs as Category[]).map((category) => [category._id, category]))
}

export const getAccounts = async (journalId: string): Promise<Record<string, Account>> => {
	const result = await db.find({
		selector: {
			'$and': [
				{ kind: 'zisk:account' },
				{ journalId },
			],
		},
		limit: ARBITRARY_MAX_FIND_LIMIT,
	})

	return Object.fromEntries((result.docs as Account[]).map((account) => [account._id, account]))
}

export const getJournalEntriesByUpstreamFilters = async (
	journalId: string,
	facets: Partial<SearchFacets>,
): Promise<JournalEntry[]> => {
	const selectorClauses: any[] = [
		{ kind: 'zisk:entry' },
		{ journalId },
	]

	Object.entries(facets)
		.filter(([, props]) => Boolean(props))
		.forEach(([key, props]) => {
			const facetKey = key as keyof SearchFacets;
			const filter = FacetedSearchUpstreamFilters[facetKey];
			if (!filter) {
				return;
			}
			const clauses = filter(props as any);
			if (!clauses) {
				return;
			}

			clauses.forEach((clause: any) => selectorClauses.push(clause));
		});

		const selector = {
			'$and': selectorClauses,
		}

		console.log('final selector:', selector)

		const result = await db.find({
			selector,
			limit: ARBITRARY_MAX_FIND_LIMIT,
		})

		// const entries = Object.fromEntries((result.docs as JournalEntry[]).map((entry) => [entry._id, entry])) as Record<string, JournalEntry>

		return result.docs as JournalEntry[]
}

export const getEntryTags = async (journalId: string): Promise<Record<string, EntryTag>> => {
	const result = await db.find({
		selector: {
			'$and': [
				{ kind: 'zisk:tag' },
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
			kind: 'zisk:meta',
		},
	})
	if (results.docs.length > 0) {
		return results.docs[0] as unknown as ZiskMeta
	}

	const meta: ZiskMeta = { ...makeDefaultZiskMeta() }
	await db.put(meta)
	return meta
}

export const getJournals = async (): Promise<Record<string, Journal>> => {
	const result = await db.find({
		selector: {
			kind: 'zisk:journal',
		},
		limit: ARBITRARY_MAX_FIND_LIMIT,
	})

	return Object.fromEntries((result.docs as unknown as Journal[]).map((journal) => [journal._id, journal]))
}

export const getArtifacts = async (journalId: string): Promise<Record<string, EntryArtifact>> => {
	const result = await db.find({
		selector: {
			'$and': [
				{ kind: 'zisk:artifact' },
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
