import { JournalEditorView } from '@/components/journal/JournalEditor'
import { JournalEntry } from '@/types/schema'
import { DefinedUseQueryResult } from '@tanstack/react-query'
import { createContext } from 'react'

export interface JournalEditorState {
	view: JournalEditorView
	date: string
	setDate: (date: string) => void
	onNextPage: () => void
	onPrevPage: () => void
}

interface JournalEntryContext extends JournalEditorState {
	getJournalEntriesQuery: DefinedUseQueryResult<
		Record<JournalEntry['_id'], JournalEntry>,
		Error
	>
	refetchAllDependantQueries: () => void
}

export const JournalEntryContext = createContext<JournalEntryContext>({} as JournalEntryContext)
