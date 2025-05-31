import { Edit, SwapHoriz } from '@mui/icons-material'
import { Alert, Avatar, Button, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { PLACEHOLDER_UNNAMED_JOURNAL_NAME } from '@ui/constants/journal'
import { JournalContext } from '@ui/contexts/JournalContext'
import { getDatabaseClient } from '@ui/database/client'
import { Journal } from '@ui/schema/documents/Journal'
import { useContext } from 'react'
import AvatarIcon from '../icon/AvatarIcon'
import SettingsSectionHeader from './SettingsSectionHeader'

const db = getDatabaseClient()

export default function JournalSettings() {
  const journalContext = useContext(JournalContext)

  const { activeJournalId } = journalContext

  const getJournalMetaQuery = useQuery<Journal | null>({
    queryKey: ['journal', activeJournalId],
    queryFn: async (): Promise<Journal | null> => {
      return db.get(activeJournalId!) ?? (null as Journal | null)
    },
    enabled: Boolean(activeJournalId),
    initialData: null,
  })

  const journal: Journal | null = getJournalMetaQuery.data

  if (!journal) {
    return <Alert />
  }

  return (
    <Stack spacing={2}>
      <section>
        <Stack direction="row" gap={1} alignItems={'flex-start'} justifyContent={'space-between'}>
          <Stack direction="row" gap={1} alignItems={'center'}>
            <Avatar>
              <AvatarIcon avatar={journal.avatar} />
            </Avatar>
            <Stack gap={0.25}>
              <Typography variant="h6" mb={0} sx={{ lineHeight: '1' }}>
                {journal.journalName || PLACEHOLDER_UNNAMED_JOURNAL_NAME}
              </Typography>
              <Stack direction="row" alignItems="center" mb={0} gap={0.5}>
                <Typography variant="body2" color="textSecondary" sx={{ lineHeight: '1' }}>
                  Your active journal
                </Typography>
                <Button
                  startIcon={<SwapHoriz />}
                  sx={{ my: -0.25, py: 0.25 }}
                  size="small"
                  onClick={() => {
                    throw new Error('Not implemented')
                  }}>
                  Switch journals
                </Button>
              </Stack>
            </Stack>
          </Stack>
          <Button disabled variant="contained" startIcon={<Edit />}>
            Edit Journal
          </Button>
        </Stack>
      </section>
      <section>
        <SettingsSectionHeader title="Import & Export" />
      </section>
      <section>
        <SettingsSectionHeader title="About" />
      </section>
    </Stack>
  )
}
