import { JournalContext } from '@/contexts/JournalContext'
import { JournalEditorState, JournalEntryContext } from '@/contexts/JournalEntryContext'
import { getEnhancedJournalEntries } from '@/database/queries'
import { EnhancedJournalEntry } from '@/types/schema'
import { useQuery } from '@tanstack/react-query'
import { PropsWithChildren, useContext, useEffect } from 'react'

type JournalEntryContextProviderProps = PropsWithChildren<JournalEditorState>

export default function JournalEntryContextProvider(props: JournalEntryContextProviderProps) {
	const { view, date, setDate, onNextPage, onPrevPage } = props

	const journalContext = useContext(JournalContext)

	const hasSelectedJournal = Boolean(journalContext.journal)

	const getEnhancedJournalEntriesQuery = useQuery<Record<EnhancedJournalEntry['_id'], EnhancedJournalEntry>>({
		queryKey: ['enhancedJournalEntries', view, date],
		queryFn: async () => {
			if (!journalContext.journal) {
				return {}
			}
			return getEnhancedJournalEntries(view, date, journalContext.journal._id)
		},
		initialData: {},
		enabled: hasSelectedJournal,
	})

	const refetchAllDependantQueries = () => {
		getEnhancedJournalEntriesQuery.refetch()
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
		journalContext.showJournalEntryModal,
	])

	return (
		<JournalEntryContext.Provider
			value={{
				view,
				date,
				setDate,
				onNextPage,
				onPrevPage,
				getEnhancedJournalEntriesQuery,
			}}>
			{props.children}
		</JournalEntryContext.Provider>
	)
}
