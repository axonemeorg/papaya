import { Account, Category, EntryTag, JournalEntry, JournalMeta, TransferEntry } from '@/types/schema'
import { DefinedUseQueryResult } from '@tanstack/react-query'
import { createContext } from 'react'
import { UseFormReturn } from 'react-hook-form'

export interface JournalContext {
	getJournalsQuery: DefinedUseQueryResult<Record<JournalMeta['_id'], JournalMeta>, Error>
	getCategoriesQuery: DefinedUseQueryResult<Record<Category['_id'], Category>, Error>
	getAccountsQuery: DefinedUseQueryResult<Record<Account['_id'], Account>, Error>
	getEntryTagsQuery: DefinedUseQueryResult<Record<EntryTag['_id'], EntryTag>, Error>
	showJournalEntryModal: boolean
	journal: JournalMeta | null
	journalEntryForm: UseFormReturn<JournalEntry | TransferEntry>
	closeEntryModal: () => void
	createJournalEntry: (value?: Partial<JournalEntry | TransferEntry>) => void
	editJournalEntry: (entry: JournalEntry | TransferEntry) => void
	openJournalManager: () => void
	closeActiveJournal: () => void
}

export const JournalContext = createContext<JournalContext>({} as JournalContext)
