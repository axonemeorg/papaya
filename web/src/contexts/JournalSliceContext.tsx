import { SelectAllAction } from '@/components/journal/JournalHeader'
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
	switchDateView: (view: JournalEditorDateViewSymbol) => void
}

interface JournalSliceContext extends JournalEditorState {
	getJournalEntriesQuery: DefinedUseQueryResult<
		Record<JournalEntry['_id'], JournalEntry>,
		Error
	>
	refetchAllDependantQueries: () => void

	// Selecting
	numRows: number
	selectedRows: Record<string, boolean>
	onSelectAll: (action: SelectAllAction) => void
	toggleSelectedRow: (row: string) => void
}

export const JournalSliceContext = createContext<JournalSliceContext>({} as JournalSliceContext)
