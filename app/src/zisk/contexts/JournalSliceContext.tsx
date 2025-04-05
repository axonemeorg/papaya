import { SelectAllAction } from '@/components/journal/ribbon/JournalEntrySelectionActions'
import { JournalFilterSlot } from '@/components/journal/ribbon/JournalFilterPicker'
import { AmountRange, Analytics, DateView, DateViewSymbol, JournalEntry, JournalSlice, TentativeJournalEntry, TentativeTransferEntry, TransferEntry } from '@/types/schema'
import { DefinedUseQueryResult } from '@tanstack/react-query'
import { createContext } from 'react'

export type JournalEditorState = { dateView: DateView } & {
	onChangeDateView: (dateView: DateView) => void
	switchDateView: (view: DateViewSymbol) => void
}

type JournalSliceContext = JournalEditorState & JournalSlice & {
	// Queries
	getTentativeJournalEntryRecurrencesQuery: DefinedUseQueryResult<
		Record<JournalEntry['_id'], TentativeJournalEntry>,
		Error
	>
	getTentativeTransferEntryRecurrencesQuery: DefinedUseQueryResult<
		Record<JournalEntry['_id'], TentativeTransferEntry>,
		Error
	>
	getJournalEntriesQuery: DefinedUseQueryResult<
		Record<JournalEntry['_id'], JournalEntry>,
		Error
	>
	getTransferEntriesQuery: DefinedUseQueryResult<
		Record<TransferEntry['_id'], TransferEntry>,
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

	// Analytics
	analyticsQuery: DefinedUseQueryResult<
		Analytics,
		Error
	>
}

export const JournalSliceContext = createContext<JournalSliceContext>({} as JournalSliceContext)
