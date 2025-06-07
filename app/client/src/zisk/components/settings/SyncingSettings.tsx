import { ZiskContext } from '@/contexts/ZiskContext'
import { LeakAdd, LeakRemove } from '@mui/icons-material'
import { Alert, Button, Link, Paper, Stack, Typography } from '@mui/material'
import { useContext, useState } from 'react'
import SettingsSectionHeader from './SettingsSectionHeader'
// import JoinServerModal from "../modal/JoinServerModal"
import { RemoteContext } from '@/contexts/RemoteContext'
import { __purgeAllLocalDatabases } from '@/database/actions'
import { useZiskMeta } from '@/hooks/queries/useZiskMeta'
import { UserSettings } from '@/schema/models/UserSettings'
import { ServerSyncStrategy } from '@/schema/support/syncing'
import { getServerApiUrl, getSyncStrategy } from '@/utils/server'
import JoinServerModal from '../modal/JoinServerModal'
import ServerWidget from '../widget/ServerWidget'
import SyncWidget from '../widget/SyncWidget'

const POUCH_DB_DOCS_URL = 'https://pouchdb.com/'
// const ZISK_SERVER_DOCS_URL = 'https://github.com/curtisupshall/zisk/tree/master/server'

type SyncingStrategy = 'NONE' | 'ZISK_SERVER'

export default function SyncingSettings() {
  const [showJoinServerModal, setShowJoinServerModal] = useState<boolean>(false)
  const [showChangeSyncStrategyModal, setShowChangeSyncStrategyModal] = useState<boolean>(false)

  const ziskContext = useContext(ZiskContext)
  const remoteContext = useContext(RemoteContext)
  const getZiskMetaQuery = useZiskMeta()
  // const { snackbar } = useContext(NotificationsContext)

  if (!getZiskMetaQuery.data) {
    return <></>
  }

  const settings: UserSettings = getZiskMetaQuery.data.userSettings
  const syncStrategy = getSyncStrategy(settings);
  const { syncType } = syncStrategy
  const ziskServerStrategy: ServerSyncStrategy | null = syncType === 'SERVER' ? syncStrategy : null

  const handleDisconnectFromServer = async () => {
    const confirmDisconnect = window.confirm(
      'Are you sure you want to disconnect? You will no longer be able to sync with your server until you sign back in.',
    )

    if (!confirmDisconnect) {
      return
    }

    if (syncType === 'SERVER') {
      const serverApiUrl = getServerApiUrl(syncStrategy.server.url)

      try {
        await fetch(`${serverApiUrl}/logout`, {
          method: 'POST',
          credentials: 'include',
        })
      } catch {
        // Do nothing
      }

      ziskContext.updateSettings({
        syncStrategy: {
          syncType: 'LOCAL' // Switch to local sync strategy
        }
      })
    } else {
      throw new Error('Disconnecting from Zisk Cloud is not implemented')
    }
  }

  const handleDeleteAllLocalData = async () => {
    const confirmed = window.confirm(
      'ALL local data will be permanently removed. Any data saved to a remote database will be kept.',
    )
    if (confirmed) {
      // Erase all pouchdb Data
      await __purgeAllLocalDatabases()
    }
  }

  return (
    <>
      <JoinServerModal
        open={showJoinServerModal}
        onClose={() => setShowJoinServerModal(false)}
      />
      <Stack gap={3}>
        <section>
          <SettingsSectionHeader title="Your Server" />
          <Typography variant="body2" color="textSecondary" mb={2}>
            Zisk Server is an optional web server for syncing and analyzing your Zisk journal. Data replication is
            automatically implemented using CouchDB, but you can host your own instance of CouchDB. You may also choose
            not to connect to a server, and your data will only persist on your device.
          </Typography>
          {ziskServerStrategy ? (
            <Stack gap={2}>
              <Alert severity="success">You are connected to a Zisk Server.</Alert>
              <Paper
                variant="outlined"
                sx={(theme) => ({
                  background: 'none',
                  borderRadius: theme.shape.borderRadius,
                  alignSelf: 'flex-start',
                })}>
                <ServerWidget
                  serverUrl={ziskServerStrategy.server.url}
                  serverName={ziskServerStrategy.server.displayName}
                  userName={ziskServerStrategy.connection.username}
                  actions={
                    <Button
                      onClick={() => handleDisconnectFromServer()}
                      startIcon={<LeakRemove />}>
                      Sign Out
                    </Button>
                  }
                />
              </Paper>
            </Stack>
          ) : (
            <Stack gap={2}>
              <Alert severity="info">You are not connected to a Zisk Server.</Alert>
              <Button
                variant="contained"
                startIcon={<LeakAdd />}
                onClick={() => setShowJoinServerModal(true)}
                sx={{ alignSelf: 'flex-start' }}>
                Connect to a Server
              </Button>
            </Stack>
          )}
        </section>
        <section>
          <SettingsSectionHeader title="Syncing Strategy" />
          <Typography variant="body2" color="textSecondary" mb={2}>
            Zisk uses <Link target='_blank' href={POUCH_DB_DOCS_URL}>PouchDB</Link> to store your journals. If you are connected to a
            Zisk Server, it can be used to sync your journals. You can also sync your journals using your own CouchDB
            server, or just store them on this device only.
          </Typography>
          <Stack gap={2}>
            {/* {syncStrategy.strategyType === 'LOCAL' && (
              <Alert severity={ziskServer.serverType === 'NONE' ? 'info' : 'warning'}>
                {ziskServer.serverType === 'NONE'
                  ? 'You are using the local syncing strategy. Your journals will only be stored on this device.'
                  : "You're connected to a Zisk Server, but you're not using it to sync your journals. You can connect to your server to sync your journals."}
              </Alert>
            )}
            {syncStrategy.strategyType === 'CUSTOM_SERVER_OR_ZISK_CLOUD' && (
              <Alert severity="success">You are using a Zisk Server to sync your journals.</Alert>
            )} */}
            <Paper
              variant="outlined"
              sx={(theme) => ({ background: 'none', borderRadius: theme.shape.borderRadius, alignSelf: 'flex-start' })}>
              <SyncWidget />
            </Paper>
            <Stack direction='row' gap={1}>
              <pre>Auth:{remoteContext.authStatus}</pre>
              <pre>Online:{remoteContext.onlineStatus}</pre>
              <pre>Sync:{remoteContext.syncStatus}</pre>
            </Stack>
            {/* <Button
              variant="contained"
              startIcon={<Shuffle />}
              onClick={() => setShowChangeSyncStrategyModal(true)}
              sx={{ alignSelf: 'flex-start' }}>
              Change Syncing Strategy
            </Button> */}
          </Stack>
        </section>
        <section>
          <SettingsSectionHeader title="Danger Zone" />
          <Button color="error" variant="outlined" onClick={() => handleDeleteAllLocalData()}>
            Delete All Local Data
          </Button>
        </section>
      </Stack>
    </>
  )
}
