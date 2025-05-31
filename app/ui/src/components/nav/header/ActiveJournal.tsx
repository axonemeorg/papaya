import { UnfoldMore } from '@mui/icons-material'
import { Button, Tooltip, Typography } from '@mui/material'
import { PLACEHOLDER_UNNAMED_JOURNAL_NAME } from '@ui/constants/journal'
import { JournalContext } from '@ui/contexts/JournalContext'
import { useJournals } from '@ui/hooks/queries/useJournals'
import { Journal } from '@ui/schema/documents/Journal'
import { useJournalSelectorStatus, useSetJournalSelectorStatus } from '@ui/store/app/useJournalSelectorState'
import { useContext } from 'react'

export default function ActiveJournal() {
  const journalContext = useContext(JournalContext)
  const { activeJournalId } = journalContext

  const setJournalSelectorStatus = useSetJournalSelectorStatus()
  const journalSelectorStatus = useJournalSelectorStatus()

  const getJournalsQuery = useJournals()
  const journals = getJournalsQuery.data
  const activeJournal: Journal | null = activeJournalId ? (journals[activeJournalId] ?? null) : null

  let journalName = activeJournal?.journalName
  if (journalName === '') {
    journalName = PLACEHOLDER_UNNAMED_JOURNAL_NAME
  }

  return (
    <Tooltip title="Manage Journals">
      {journalSelectorStatus === 'CLOSED' && !activeJournal ? (
        <Button variant="contained" onClick={() => setJournalSelectorStatus('SELECTING')}>
          Select Journal
        </Button>
      ) : (
        <Button endIcon={<UnfoldMore />} onClick={() => setJournalSelectorStatus('SELECTING')}>
          <Typography variant="h6">{journalName}</Typography>
        </Button>
      )}
    </Tooltip>
  )
}
