import SelectJournalModal from '@/components/journal/SelectJournalModal'
import JournalEntryModal from '@/components/modal/JournalEntryModal'
import { JournalContext } from '@/contexts/JournalContext'
import { getDatabaseClient } from '@/database/client'

import { updateActiveJournal } from '@/database/actions'
import { useJournals } from '@/hooks/queries/useJournals'
import { usePapayaMeta } from '@/hooks/queries/usePapayaMeta'
import { useJournalSelectorStatus, useSetJournalSelectorStatus } from '@/store/app/useJournalSelectorState'
import { PropsWithChildren, useEffect, useState } from 'react'

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

  const handleSelectNewActiveJournal = (journalId: string | null) => {
    setActiveJournalId(journalId)
    updateActiveJournal(journalId)
  }

  const getJournalsQuery = useJournals()
  const getPapayaMetaQuery = usePapayaMeta()

  useEffect(() => {
    if (hasLoadedInitialActiveJournal) {
      return
    }
    if (!getPapayaMetaQuery.isFetched) {
      return
    }
    if (!getPapayaMetaQuery.data?.activeJournalId) {
      // No active journal is set or active journaland papayaMeta active journal do not agree; prompt user to select one
      console.log(
        'No active journal is set or active journaland papayaMeta active journal do not agree; prompt user to select one',
      )
      setJournalSelectorStatus('SELECTING')
    } else {
      setActiveJournalId(getPapayaMetaQuery.data?.activeJournalId)
    }
    setHasLoadedInitialActiveJournal(true)
  }, [getJournalsQuery.isFetched, getPapayaMetaQuery.isFetched, hasLoadedInitialActiveJournal])

  // useEffect(() => {
  // 	 else if (!getJournalsQuery.isFetched) {
  // 		return
  // 	} else if (journalContext.activeJournalId) {
  // 		setHasLoadedInitialActiveJournal(true)
  // 		return
  // 	} else
  // 	setJournalSelectorStatus('SELECTING')
  // }, [hasLoadedInitialActiveJournal, papayaMeta, journalContext.activeJournalId])

  return (
    <JournalContext.Provider
      value={{
        activeJournalId,
        setActiveJournalId: handleSelectNewActiveJournal,
      }}>
      <SelectJournalModal />
      <JournalEntryModal />
      {props.children}
    </JournalContext.Provider>
  )
}
