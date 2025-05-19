import SelectJournalModal from '@/components/journal/SelectJournalModal'
import JournalEntryModal from '@/components/modal/JournalEntryModal'
import { JournalContext } from '@/contexts/JournalContext'
import { ZiskContext } from '@/contexts/ZiskContext'
import { getDatabaseClient } from '@/database/client'

import { PropsWithChildren, useContext, useEffect, useState } from 'react'
import { updateActiveJournal } from '@/database/actions'
import { useJournalSelectorStatus, useSetJournalSelectorStatus } from '@/store/app/useJournalSelectorState'
import { useJournals } from '@/hooks/queries/useJournals'

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
	// The currently active journal
	const [activeJournalId, setActiveJournalId] = useState<string | null>(null)

	const [, setJournalSelectorStatus] = [useJournalSelectorStatus(), useSetJournalSelectorStatus()]
	
	const [hasLoadedInitialActiveJournal, setHasLoadedInitialActiveJournal] = useState<boolean>(false)

	const ziskContext = useContext(ZiskContext)

	const handleSelectNewActiveJournal = (journalId: string | null) => {
		setActiveJournalId(journalId)
		updateActiveJournal(journalId)
	}

	const getJournalsQuery = useJournals()

	useEffect(() => {
		if (hasLoadedInitialActiveJournal) {
			return
		} if (!ziskContext.queries.ziskMeta.isFetched) {
			return
		}
		console.log('ziskContext.queries.ziskMeta:', ziskContext.queries.ziskMeta)
		if (!ziskContext.queries.ziskMeta.data?.activeJournalId) {
			// No active journal is set or active journaland ziskMeta active journal do not agree; prompt user to select one
			console.log('No active journal is set or active journaland ziskMeta active journal do not agree; prompt user to select one')
			setJournalSelectorStatus('SELECTING')
		} else {
			setActiveJournalId(ziskContext.queries.ziskMeta.data?.activeJournalId)
		}
		setHasLoadedInitialActiveJournal(true)
	}, [getJournalsQuery.isFetched, ziskContext.queries.ziskMeta.isFetched, hasLoadedInitialActiveJournal])

	// useEffect(() => {
	// 	 else if (!getJournalsQuery.isFetched) {
	// 		return
	// 	} else if (journalContext.activeJournalId) {
	// 		setHasLoadedInitialActiveJournal(true)
	// 		return
	// 	} else 
	// 	setJournalSelectorStatus('SELECTING')
	// }, [hasLoadedInitialActiveJournal, ziskMeta, journalContext.activeJournalId])


	return (
		<JournalContext.Provider
			value={{
				activeJournalId,
				setActiveJournalId: handleSelectNewActiveJournal,
			}}>
			<SelectJournalModal />
			<JournalEntryModal  />
			{props.children}
		</JournalContext.Provider>
	)
}
