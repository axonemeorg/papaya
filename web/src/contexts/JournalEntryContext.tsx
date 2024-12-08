import { JournalEditorView } from '@/components/journal/JournalEditor'
import { JournalFilters } from '@/components/journal/JournalFilters'
import { EnhancedJournalEntry } from '@/types/schema'
import { DefinedUseQueryResult } from '@tanstack/react-query'
import { createContext } from 'react'

export interface JournalEditorState {
	view: JournalEditorView
	date: string
	filters: JournalFilters
	setFilters: (filters: JournalFilters) => void
	setDate: (date: string) => void
	onNextPage: () => void
	onPrevPage: () => void
}

interface JournalEntryContext extends JournalEditorState {
	getEnhancedJournalEntriesQuery: DefinedUseQueryResult<
		Record<EnhancedJournalEntry['_id'], EnhancedJournalEntry>,
		Error
	>
}

export const JournalEntryContext = createContext<JournalEntryContext>({} as JournalEntryContext)
