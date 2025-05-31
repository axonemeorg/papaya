import { Box, Button, CardActions, CardHeader, Divider, LinearProgress } from '@mui/material'
import { RemoteContext, SyncStatusEnum } from '@ui/contexts/RemoteContext'
import { getSyncStatusTitles } from '@ui/utils/string'
import { useContext, useMemo } from 'react'
import SyncIcon from '../icon/SyncIcon'

const ENABLE_SYNC_DEBUGGING = false

export default function SyncWidget() {
  const remoteContext = useContext(RemoteContext)
  const { syncStatus } = remoteContext

  const { syncStatusTitle, syncStatusDescription } = useMemo(() => {
    return getSyncStatusTitles(syncStatus)
  }, [syncStatus])

  const handleSync = () => {
    remoteContext.sync()
  }

  const isLoading = [SyncStatusEnum.SAVING, SyncStatusEnum.CONNECTING_TO_REMOTE].includes(syncStatus)

  return (
    <Box>
      <CardHeader
        avatar={<SyncIcon syncStatus={syncStatus} sx={{ transition: 'all 0.3s' }} />}
        title={syncStatusTitle}
        subheader={syncStatusDescription}
      />
      {ENABLE_SYNC_DEBUGGING && remoteContext.syncError && <pre>{remoteContext.syncError}</pre>}
      {remoteContext.syncSupported && (
        <>
          {isLoading ? <LinearProgress variant="indeterminate" /> : <Divider sx={{ height: '1px', my: '1.5px' }} />}
          <CardActions>
            <Button onClick={handleSync}>Sync Now</Button>
          </CardActions>
        </>
      )}
    </Box>
  )
}
