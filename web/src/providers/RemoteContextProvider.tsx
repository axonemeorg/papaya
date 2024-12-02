import { RemoteContext, SyncStatusEnum } from "@/contexts/RemoteContext";
import { getSession, useSession } from "next-auth/react";
import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import PouchDB from 'pouchdb';
import { db } from "@/database/client";

const REMOTE_DB_API_PATH = 'api/remote-db';
const REMOTE_DB_PROXY_PATH = `${REMOTE_DB_API_PATH}/proxy`;

export default function RemoteContextProvider(props: PropsWithChildren) {
    const userSession = useSession();

    const initialSyncStatus = useMemo(() => {
        if (userSession?.status === 'unauthenticated') {
            return SyncStatusEnum.WORKING_LOCALLY;
        }
        return SyncStatusEnum.IDLE;
    }, []);

    const [syncError, setSyncError] = useState<string | null>(null);
    const [syncStatus, setSyncStatus] = useState<SyncStatusEnum>(initialSyncStatus);
    
    const remoteDb = useRef<PouchDB.Database | null>(null);

    const isAuthenticated = userSession.status === 'authenticated';

    const getRemoteDbApiUrl = () => {
        return `${process.env.NEXT_PUBLIC_APP_URL}/${REMOTE_DB_API_PATH}`;
    }

    const getRemoteDbProxyUrl = () => {
        return `${process.env.NEXT_PUBLIC_APP_URL}/${REMOTE_DB_PROXY_PATH}`;
    }

    const createRemote = async () => {
        console.log('Creating remote database...');
        if (!isAuthenticated) {
            throw new Error('User is not authenticated');
        }

        setSyncStatus(SyncStatusEnum.CONNECTING_TO_REMOTE);

        try {
            // Step 1. Init the database
            const initUrl = `${getRemoteDbApiUrl()}/init`;
            const initResult = await fetch(initUrl, {
                method: 'POST',
            });

            if (initResult.status !== 200) {
                throw new Error('Failed to initialize remote database');
            }
            
            // Step 2. Create the remote database PouchDB instance
            const remoteProxyUrl = getRemoteDbProxyUrl();
        
            remoteDb.current = new PouchDB(remoteProxyUrl, {
                skip_setup: true,
            });

            console.log('Established connection to remote database. Syncing...');
            performSync();
        } catch (err) {
            console.error('Failed to create remote database:', err);
            remoteDb.current = null;

            setSyncStatus(SyncStatusEnum.FAILED_TO_CONNECT);
        }
    }

    const performSync = async () => {
        if (!remoteDb.current) {
            console.error('Remote database is not connected');
            return;
        }

        setSyncStatus(SyncStatusEnum.SAVING);

        db.sync(remoteDb.current).then((info) => {
            console.log('Sync complete', info);
            setSyncStatus(SyncStatusEnum.SAVED_TO_REMOTE);
        }).catch((err) => {
            console.error('Sync error', err);
            setSyncError(err.message);
            setSyncStatus(SyncStatusEnum.FAILED_TO_SAVE);
        });
    }

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        createRemote();
    }, [isAuthenticated]);

    const sync = async () => {
        performSync();
    }

    const context: RemoteContext = {
        syncError,
        syncStatus,
        sync,
        isAuthenticated,
    };

    return (
        <RemoteContext.Provider value={context}>
            {props.children}
        </RemoteContext.Provider>
    )
}
