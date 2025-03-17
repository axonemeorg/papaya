import { DateView, JournalEntry } from '@/types/schema'
import { DefinedUseQueryResult } from '@tanstack/react-query'
import { createContext } from 'react'

export enum JournalEditorDateViewSymbol {
	WEEKLY = 'w',
	MONTHLY = 'm',
	YEARLY = 'y',
	RANGE = 'r',
}

export interface JournalEditorState {
	dateView: DateView
	onChangeDateView: (dateView: DateView) => void
}

interface JournalEntryContext extends JournalEditorState {
	getJournalEntriesQuery: DefinedUseQueryResult<
		Record<JournalEntry['_id'], JournalEntry>,
		Error
	>
	refetchAllDependantQueries: () => void
}

export const JournalEntryContext = createContext<JournalEntryContext>({} as JournalEntryContext)
