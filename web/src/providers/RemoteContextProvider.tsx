import { RemoteContext, SyncStatusEnum } from "@/contexts/RemoteContext";
import { ZiskSettings } from "@/types/schema";
import { PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from "react";
import PouchDB from 'pouchdb'
import { ZiskContext } from "@/contexts/ZiskContext";

const ZISK_CLOUD_HOST = process.env.NEXT_PUBLIC_ZISK_CLOUD_HOST
const ENABLE_ZISK_CLOUD = process.env.NEXT_PUBLIC_F_ENABLE_ZISK_CLOUD === 'true'

export default function RemoteContextProvider(props: PropsWithChildren) {
    const [syncError, setSyncError] = useState<string | null>(null)
    const [syncStatus, setSyncStatus] = useState<SyncStatusEnum>(SyncStatusEnum.IDLE)

    const remoteDb = useRef<PouchDB.Database | null>(null)

    const ziskContext = useContext(ZiskContext)
    const settings: ZiskSettings | null = ziskContext?.data?.settings ?? null

    const sync = async () => {
        if (!remoteDb.current) {
            return
        }
        setSyncStatus(SyncStatusEnum.SAVING)
        setSyncError(null)
        try {
            // Perform sync
            setSyncStatus(SyncStatusEnum.SAVED_TO_REMOTE)
        } catch (error: any) {
            setSyncError(error.message)
            setSyncStatus(SyncStatusEnum.FAILED_TO_SAVE)
        }
    }

    const initRemoteConnectionFromConfig = async (settings: ZiskSettings)  => {
        console.log('Initializing remote connection from config')
        const { syncingStrategy, server } = settings

        if (syncingStrategy.strategyType === 'LOCAL') {
            return
        } else if (syncingStrategy.strategyType === 'COUCH_DB') {
            remoteDb.current = new PouchDB(syncingStrategy.couchDbUrl)
        } else if (syncingStrategy.strategyType === 'CUSTOM_SERVER_OR_ZISK_CLOUD') {
            if (server.serverType === 'NONE') {
                setSyncError('No server configured')
                setSyncStatus(SyncStatusEnum.FAILED_TO_CONNECT)
                return
            } else if (server.serverType === 'ZISK_CLOUD') {
                if (!ENABLE_ZISK_CLOUD || !ZISK_CLOUD_HOST) {
                    setSyncError('Zisk Cloud is not enabled')
                    setSyncStatus(SyncStatusEnum.FAILED_TO_CONNECT)
                    return
                }
                setSyncStatus(SyncStatusEnum.CONNECTING_TO_REMOTE)
                // TODO
            } else if (server.serverType === 'CUSTOM') {
                if (!server.serverUrl) {
                    setSyncError('No server URL configured')
                    setSyncStatus(SyncStatusEnum.FAILED_TO_CONNECT)
                    return
                }
                // TODO still need a way to determine what the user's database will be called
                const _databaseUrl = server.serverUrl + '/database'
                remoteDb.current = new PouchDB(syncingStrategy.serverUrl)
            }
        }

        setSyncStatus(SyncStatusEnum.IDLE)
        return sync()
    }

    const syncSupported = useMemo(() => {
        if (!settings) {
            return false
        }
        return settings.syncingStrategy.strategyType !== 'LOCAL'
    }, [settings])

    useEffect(() => {
        if (!settings) {
            return
        }
        initRemoteConnectionFromConfig(settings)
    }, [settings])

    const remoteContext = {
        syncError,
        syncStatus,
        syncSupported,
        sync,
    }

    return (
        <RemoteContext.Provider value={remoteContext}>
            {props.children}
        </RemoteContext.Provider>
    )
}
