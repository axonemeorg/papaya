import { SelectAllAction } from '@/components/journal/ribbon/JournalEntrySelectionActions'
import { JournalFilterSlot } from '@/components/journal/ribbon/JournalFilterPicker'
import { AmountRange, DateView, JournalEntry, JournalSlice } from '@/types/schema'
import { DefinedUseQueryResult } from '@tanstack/react-query'
import { createContext } from 'react'

export enum JournalEditorDateViewSymbol {
	WEEKLY = 'w',
	MONTHLY = 'm',
	YEARLY = 'y',
	RANGE = 'r',
}

export type JournalEditorState = { dateView: DateView } & {
	onChangeDateView: (dateView: DateView) => void
	switchDateView: (view: JournalEditorDateViewSymbol) => void
}

type JournalSliceContext = JournalEditorState & JournalSlice & {
	// Queries
	getJournalEntriesQuery: DefinedUseQueryResult<
		Record<JournalEntry['_id'], JournalEntry>,
		Error
	>
	refetchAllDependantQueries: () => void

	// Filter slots
	onChangeCategoryIds: (categoryIds: string[] | undefined) => void
	onChangeAmountRange: (amountRange: AmountRange | undefined) => void

	// Filter Actions
	getActiveFilterSet: () => Set<JournalFilterSlot>
	clearAllSliceFilters: () => void
	removeFilterBySlot: (slice: JournalFilterSlot) => void

	// Selecting
	numRows: number
	selectedRows: Record<string, boolean>
	onSelectAll: (action: SelectAllAction) => void
	toggleSelectedRow: (row: string) => void
}

export const JournalSliceContext = createContext<JournalSliceContext>({} as JournalSliceContext)
