import SelectJournalModal from '@/components/journal/SelectJournalModal'
import JournalEntryModal from '@/components/modal/JournalEntryModal'
import { JournalContext } from '@/contexts/JournalContext'
import { NotificationsContext } from '@/contexts/NotificationsContext'
import { ZiskContext } from '@/contexts/ZiskContext'
import { getDatabaseClient } from '@/database/client'
// import { MigrationEngine } from '@/database/migrate'
import { getAccounts, getCategories, getEntryTags, getJournals } from '@/database/queries'

import { useQuery } from '@tanstack/react-query'
import { PropsWithChildren, useContext, useState } from 'react'
import { Journal } from '@/schema/documents/Journal'
import { Category } from '@/schema/documents/Category'
import { EntryTag } from '@/schema/documents/EntryTag'
import { Account } from '@/schema/documents/Account'
import { useSetCategories } from '@/store/orm/categories'
import { useSetEntryTags } from '@/store/orm/tags'
import { useSetAccounts } from '@/store/orm/accounts'
import { useSetJournals } from '@/store/orm/journals'

const db = getDatabaseClient()

db.createIndex({
	index: {
		fields: [
			'type', // Deprecated
			'kind',
			'date',
			'children',
			'journalId',
			'recurs',
		],
	},
})

export default function JournalContextProvider(props: PropsWithChildren) {
	// Stores
	const setJournals = useSetJournals()
	const setCategories = useSetCategories()
	const setEntryTags = useSetEntryTags()
	const setAccounts = useSetAccounts()

	// The currently active journal
	const [activeJournal, setActiveJournal] = useState<Journal | null>(null)

	// const { snackbar } = useContext(NotificationsContext)
	// const ziskContext = useContext(ZiskContext)

	const hasSelectedJournal = Boolean(activeJournal)

	const getJournalsQuery = useQuery<Record<string, Journal>>({
		queryKey: ['journals'],
		queryFn: async () => {
			const response: Record<string, Journal> = await getJournals()
			setJournals(response)
			return response
		},
		initialData: {},
	})

	const getCategoriesQuery = useQuery<Record<string, Category>>({
		queryKey: ['categories'],
		queryFn: async () => {
			let response: Record<string, Category>
			response = activeJournal
				? await getCategories(activeJournal._id)
				: {}
			
			setCategories(response)
			return response
		},
		initialData: {},
		enabled: hasSelectedJournal,
	})

	const getEntryTagsQuery = useQuery<Record<string, EntryTag>>({
		queryKey: ['tags'],
		queryFn: async () => {
			let response: Record<string, EntryTag>
			response = activeJournal
				? await getEntryTags(activeJournal._id)
				: {}

			setEntryTags(response)
			return response
		},
		initialData: {},
		enabled: hasSelectedJournal,
	})

	const getAccountsQuery = useQuery<Record<string, Account>>({
		queryKey: ['accounts'],
		queryFn: async () => {
			let response: Record<string, Account>
			response = activeJournal
				? await getAccounts(activeJournal._id)
				: {}
			
			setAccounts(response)
			return response
		},
		initialData: {},
		enabled: hasSelectedJournal,
	})

	// const openCreateEntryModal = (values: Partial<JournalEntry> = {}) => {
	// 	if (!activeJournal) {
	// 		return
	// 	}
	// 	const entry: JournalEntry = makeJournalEntry(values as CreateJournalEntry, activeJournal._id)

	// 	createJournalEntry(entry)

	// 	journalEntryForm.reset(entry)
	// 	setShowJournalEntryModal(true)
	// }

	// const openEditEntryModal = (entry: JournalEntry) => {
	// 	journalEntryForm.reset(entry)
	// 	setShowJournalEntryModal(true)
	// }

	// const promptCreateJournal = () => {
	// 	setShowSelectJournalModal(true)
	// }

	
	// useKeyboardAction(KeyboardActionName.CREATE_JOURNAL_ENTRY, () => {
	// 	if (showJournalEntryModal) {
	// 		return
	// 	}
	// 	openCreateEntryModal();
	// })

	const handleSelectNewActiveJournal = (journal: Journal | null) => {
		setActiveJournal(journal)
	}

	return (
		<JournalContext.Provider
			value={{
				queries: {
					accounts: getAccountsQuery,
					categories: getCategoriesQuery,
					journals: getJournalsQuery,
					tags: getEntryTagsQuery,
				},
				activeJournal,
				setActiveJournal: handleSelectNewActiveJournal,
			}}>
			<SelectJournalModal />
			<JournalEntryModal  />
			{props.children}
		</JournalContext.Provider>
	)
}
