import { JournalContext } from '@/contexts/JournalContext'
import { JournalEditorState, JournalEntryContext } from '@/contexts/JournalEntryContext'
import { getEnhancedJournalEntries, GetEnhancedJournalEntriesResults } from '@/database/queries'
import { useQuery } from '@tanstack/react-query'
import { PropsWithChildren, useContext, useEffect } from 'react'

type JournalEntryContextProviderProps = PropsWithChildren<JournalEditorState>

export default function JournalEntryContextProvider(props: JournalEntryContextProviderProps) {
	const { view, date, setDate, onNextPage, onPrevPage } = props

	const journalContext = useContext(JournalContext)

	const hasSelectedJournal = Boolean(journalContext.journal)

	const getEnhancedJournalEntriesQuery = useQuery<GetEnhancedJournalEntriesResults>({
		queryKey: ['enhancedJournalEntries', view, date],
		queryFn: async () => {
			if (!journalContext.journal) {
				return {
					entries: {},
					richJournalEntryMetadataRecords: {},
				}
			}
			return getEnhancedJournalEntries(view, date, journalContext.journal._id)
		},
		initialData: {
			entries: {},
			richJournalEntryMetadataRecords: {},
		},
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
