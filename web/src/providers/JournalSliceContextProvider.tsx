import { JournalContext } from '@/contexts/JournalContext'
import { JournalEditorDateViewSymbol, JournalEditorState, JournalSliceContext } from '@/contexts/JournalSliceContext'
import { getJournalEntries } from '@/database/queries'
import { DateView, JournalEntry, MonthlyPeriod, WeeklyPeriod } from '@/types/schema'
import { useQuery } from '@tanstack/react-query'
import { PropsWithChildren, useContext, useEffect, useMemo } from 'react'

type JournalSliceContextProviderProps = PropsWithChildren<JournalEditorState>

export default function JournalSliceContextProvider(props: JournalSliceContextProviderProps) {
	const { dateView, onChangeDateView, switchDateView } = props

	const journalContext = useContext(JournalContext)

	const hasSelectedJournal = Boolean(journalContext.journal)

	const getJournalEntriesQuery = useQuery<Record<JournalEntry['_id'], JournalEntry>>({
		queryKey: ['journalEntries', dateView],
		queryFn: async () => {
			if (!journalContext.journal) {
				return {}
			}
			return getJournalEntries(dateView, journalContext.journal._id)
		},
		initialData: {},
		enabled: hasSelectedJournal,
	})

	const refetchAllDependantQueries = () => {
		getJournalEntriesQuery.refetch()
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

	return (
		<JournalSliceContext.Provider
			value={{
				dateView,
				onChangeDateView,
				getJournalEntriesQuery,
				refetchAllDependantQueries,
				switchDateView,
			}}>
			{props.children}
		</JournalSliceContext.Provider>
	)
}
