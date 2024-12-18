import { JournalEditorView } from '@/components/journal/JournalEditor'
import { GetEnhancedJournalEntriesResults } from '@/database/queries'
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
	getEnhancedJournalEntriesQuery: DefinedUseQueryResult<
		GetEnhancedJournalEntriesResults,
		Error
	>
}

export const JournalEntryContext = createContext<JournalEntryContext>({} as JournalEntryContext)
