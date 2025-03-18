import { SelectAllAction } from '@/components/journal/ribbon/JournalEntrySelectionActions'
import { JournalFilterSlot } from '@/components/journal/ribbon/JournalFilterPicker'
import { JournalContext } from '@/contexts/JournalContext'
import { JournalEditorState, JournalSliceContext } from '@/contexts/JournalSliceContext'
import { getJournalEntries } from '@/database/queries'
import { JournalEntry, JournalSlice } from '@/types/schema'
import { calculateNetAmount } from '@/utils/journal'
import { useQuery } from '@tanstack/react-query'
import { PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type JournalSliceContextProviderProps = PropsWithChildren<JournalEditorState>

export default function JournalSliceContextProvider(props: JournalSliceContextProviderProps) {
	const { dateView, onChangeDateView, switchDateView } = props
	const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({})

	const [categoryIds, setCategoryIds] = useState<string[] | undefined>(undefined)

	const journalContext = useContext(JournalContext)

	const hasSelectedJournal = Boolean(journalContext.journal)

	const journalSlice: JournalSlice = useMemo(() => {
		return {
			dateView,
			categoryIds,
		}
	}, [
		dateView,
		categoryIds
	])

	const getSliceFilterCount = useCallback(() => {
		let totalFilterCount = 0
		if (categoryIds && categoryIds.length > 0) {
			totalFilterCount ++
		}
		return totalFilterCount
	}, [
		dateView,
		categoryIds
	])

	const clearAllSliceFilters = () => {
		setCategoryIds(undefined)
	}
	
	const removeFilterBySlot = (slot: JournalFilterSlot) => {
		switch (slot) {
			case JournalFilterSlot.AMOUNT:

				return
			
			case JournalFilterSlot.ATTACHMENTS:

				return

			case JournalFilterSlot.CATEGORIES:
				setCategoryIds(undefined)
				return

			case JournalFilterSlot.DATE_RANGE:

				return

			case JournalFilterSlot.TAGS:

				return
		}
	}

	const getJournalEntriesQuery = useQuery<Record<JournalEntry['_id'], JournalEntry>>({
		queryKey: ['journalEntries', journalSlice],
		queryFn: async () => {
			if (!journalContext.journal) {
				return {}
			}
			return getJournalEntries(journalSlice, journalContext.journal._id)
		},
		initialData: {},
		enabled: hasSelectedJournal,
	})

	const refetchAllDependantQueries = () => {
		getJournalEntriesQuery.refetch()
	}

	const toggleSelectedRow = (row: string) => {
		setSelectedRows((prev) => {
			return {
				...prev,
				[row]: prev[row] ? false : true
			}
		})
	}

	const handleSelectAll = (action: SelectAllAction) => {
		console.log(`handleSelectAll(${action})`)
		setSelectedRows((prev) => {
			let selected: Set<string>
			const allRowIds = new Set<string>(Object.keys(getJournalEntriesQuery.data ?? {}))
			const emptySet = new Set<string>([])
			const hasSelectedAll = Object.values(prev).length > 0 && Object.values(prev).every(Boolean)

			switch (action) {
				case SelectAllAction.ALL:
					selected = allRowIds
					break

				case SelectAllAction.NONE:
					selected = emptySet
					break

				case SelectAllAction.CREDIT:
					selected = new Set<string>(Array.from(allRowIds).filter((id: string) => {
						const entry = getJournalEntriesQuery.data[id]
						return entry ? calculateNetAmount(entry) > 0 : false
					}))
					break

				case SelectAllAction.DEBIT:
					selected = new Set<string>(Array.from(allRowIds).filter((id: string) => {
						const entry = getJournalEntriesQuery.data[id]
						return entry ? calculateNetAmount(entry) < 0 : false
					}))
					break

				case SelectAllAction.TOGGLE:
				default:
					selected = hasSelectedAll ? emptySet : allRowIds
			}

			return Object.fromEntries(Array.from(new Set([...Object.keys(prev), ...selected]))
				.map((key) => {
					return [key, selected.has(key)]
				}))
		})
	}

	useEffect(() => {
		if (!journalContext.journal) {
			return
		}

		refetchAllDependantQueries()
	}, [
		journalContext.journal,
		journalContext.getCategoriesQuery.data,
		journalContext.getEntryTagsQuery.data,
	])

	useEffect(() => {
		setSelectedRows({})
	}, [getJournalEntriesQuery.data])

	return (
		<JournalSliceContext.Provider
			value={{
				...journalSlice,
				onChangeDateView,
				switchDateView,
				onChangeCategoryIds: setCategoryIds,

				getJournalEntriesQuery,
				refetchAllDependantQueries,

				getSliceFilterCount,
				clearAllSliceFilters,
				removeFilterBySlot,

				numRows: Object.values(getJournalEntriesQuery.data ?? {}).length,
				selectedRows,
				onSelectAll: handleSelectAll,
				toggleSelectedRow,
			}}>
			{props.children}
		</JournalSliceContext.Provider>
	)
}
