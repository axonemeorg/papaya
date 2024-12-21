import { JournalContext } from '@/contexts/JournalContext'
import { JournalEditorState, JournalEntryContext } from '@/contexts/JournalEntryContext'
import { getJournalEntries } from '@/database/queries'
import { JournalEntry } from '@/types/schema'
import { useQuery } from '@tanstack/react-query'
import { PropsWithChildren, useContext, useEffect } from 'react'

type JournalEntryContextProviderProps = PropsWithChildren<JournalEditorState>

export default function JournalEntryContextProvider(props: JournalEntryContextProviderProps) {
	const { view, date, setDate, onNextPage, onPrevPage } = props

	const journalContext = useContext(JournalContext)

	const hasSelectedJournal = Boolean(journalContext.journal)

	const getJournalEntriesQuery = useQuery<Record<JournalEntry['_id'], JournalEntry>>({
		queryKey: ['journalEntries', view, date],
		queryFn: async () => {
			if (!journalContext.journal) {
				return {}
			}
			return getJournalEntries(view, date, journalContext.journal._id)
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
		<JournalEntryContext.Provider
			value={{
				view,
				date,
				setDate,
				onNextPage,
				onPrevPage,
				getJournalEntriesQuery,
				refetchAllDependantQueries,
			}}>
			{props.children}
		</JournalEntryContext.Provider>
	)
}
