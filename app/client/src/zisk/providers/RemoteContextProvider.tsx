import { AuthStatusEnum, OnlineStatusEnum, RemoteContext, SyncErrorEnum, SyncStatusEnum } from '@/contexts/RemoteContext'
import { getDatabaseClient } from '@/database/client'
import { useZiskMeta } from '@/hooks/queries/useZiskMeta'
import { UserSettings } from '@/schema/models/UserSettings'
import { ServerSyncStrategy } from '@/schema/support/syncing'
import { getSyncStrategy } from '@/utils/server'
import PouchDB from 'pouchdb'
import { PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react'

export default function RemoteContextProvider(props: PropsWithChildren) {
  const [syncError, setSyncError] = useState<SyncErrorEnum | null>(null)
  const [syncStatus, setSyncStatus] = useState<SyncStatusEnum>(SyncStatusEnum.IDLE)
  const [onlineStatus, setOnlineStatus] = useState<OnlineStatusEnum>(OnlineStatusEnum.ONLINE)
  const [authStatus, setAuthStatus] = useState<AuthStatusEnum>(AuthStatusEnum.AUTHENTICATING)

  const remoteDb = useRef<PouchDB.Database | null>(null)
  const remoteDbSyncHandler = useRef<PouchDB.Replication.Sync<{}> | null>(null)

  const getZiskMetaQuery = useZiskMeta()

  const settings: UserSettings | null = getZiskMetaQuery.data?.userSettings ?? null

  const syncStrategy = getSyncStrategy(settings);
  const { syncType } = syncStrategy

  useEffect(() => {
    if (syncType === 'LOCAL' || syncType === 'NONE') {
      // Set sync to idle
      setSyncStatus(SyncStatusEnum.IDLE)
      closeRemoteConnection()
      return;
    }
    if (syncType === 'SERVER') {
      authenticate()
        .then(() => {
          initRemoteConnectionFromServerStrategy(syncStrategy)
        })
        .catch() // Do nothing
    }

  }, [syncType])

  // Event listeners
  useEffect(() => {
    // Perform initial auth
    authenticate()

    const wentOnline = () => {
      setOnlineStatus(OnlineStatusEnum.ONLINE)
    }
    const wentOffline = () => {
      setOnlineStatus(OnlineStatusEnum.OFFLINE)
    }

    window.addEventListener('online', wentOnline);
    window.addEventListener('offline', wentOffline);

    return () => {
      window.removeEventListener('online', wentOnline);
      window.removeEventListener('offline', wentOffline);
    }
  }, [])

  /**
   * Hits the _session endpoint to check authentication
   * @returns true if the user is currently signed in
   */
  const authenticate = async (): Promise<boolean> => {
    let status: AuthStatusEnum = AuthStatusEnum.UNAUTHENTICATED

    if (syncType === 'SERVER') {
      setAuthStatus(AuthStatusEnum.AUTHENTICATING)
      const { connection } = syncStrategy
      const response = await fetch(`${connection.databaseUrl}/_session`, {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        setAuthStatus(AuthStatusEnum.AUTHENTICATED)
        return true
      }
    }

    setAuthStatus(AuthStatusEnum.UNAUTHENTICATED)
    return false
  }

  const closeRemoteConnection = () => {
    // Cancel existing sync handling and close existing database
    if (remoteDbSyncHandler.current) {
      remoteDbSyncHandler.current.cancel()
    }
    // Close connection
    if (remoteDb.current) {
      remoteDb.current.close()
    }
  }

  const initRemoteConnectionFromServerStrategy = async (serverSyncStrategy: ServerSyncStrategy) => {
    console.log('Initializing remote syncing connection from config')
    setSyncStatus(SyncStatusEnum.IDLE)

    const { connection } = serverSyncStrategy
    remoteDb.current = new PouchDB(connection.databaseUrl)
    const db = getDatabaseClient()
    remoteDbSyncHandler.current = db
      .sync(remoteDb.current, {
        live: true,
        retry: true
      })
      .on('change', function (_change) {
        setSyncStatus(SyncStatusEnum.IDLE)
      })
      .on('paused', function () {
        // replication was paused, usually because of a lost connection
        setSyncStatus(SyncStatusEnum.PAUSED)
      })
      .on('active', function () {
        // replication was resumed
        setSyncStatus(SyncStatusEnum.SYNCING)
      })
      .on('error', function (err) {
        console.error('Sync error:', err)
        setSyncStatus(SyncStatusEnum.ERROR)
      })
      .on('complete', function () {
        setSyncStatus(SyncStatusEnum.SAVED)
      })
  }

  const syncEnabled: boolean = useMemo(() => {
    return [
      syncType === 'SERVER',
      authStatus !== AuthStatusEnum.UNAUTHENTICATED,
      onlineStatus === OnlineStatusEnum.ONLINE
    ].every(Boolean)
  }, [syncType, onlineStatus])

  const remoteContext: RemoteContext = {
    // syncError,
    syncStatus,
    authStatus,
    onlineStatus,
    syncEnabled,
  }

  return <RemoteContext.Provider value={remoteContext}>{props.children}</RemoteContext.Provider>
}
