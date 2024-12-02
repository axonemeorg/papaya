import { RemoteContext } from "@/contexts/RemoteContext";
import { getSession, useSession } from "next-auth/react";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import PouchDB from 'pouchdb';
import { db } from "@/database/client";
import { get } from "http";
import { getToken } from "next-auth/jwt";

const REMOTE_DB_API_PATH = 'api/remote-db';
const REMOTE_DB_PROXY_PATH = `${REMOTE_DB_API_PATH}/proxy`;

export default function RemoteContextProvider(props: PropsWithChildren) {
    const [syncError, setSyncError] = useState<string | null>(null);

    // Create a ref for storing the PouchDB remote database.
    const remoteDb = useRef<PouchDB.Database | null>(null);

    const userSession = useSession();

    console.log('userSession:', userSession);

    // const userName = 'user1111';
    const isAuthenticated = userSession.status === 'authenticated';

    // const getDatabaseName = () => {
    //     return userName;
    // }

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

        // Step 1. Init the database
        const initUrl = `${getRemoteDbApiUrl()}/init`;
        console.log('init URL:', initUrl);
        const initResult = await fetch(initUrl, {
            method: 'POST',
        });

        if (initResult.status !== 200) {
            throw new Error('Failed to initialize remote database');
        }
        
        // Step 2. Create the remote database PouchDB instance
        const remoteProxyUrl = getRemoteDbProxyUrl();
        console.log('Remote proxy URL:', remoteProxyUrl);
        remoteDb.current = new PouchDB(remoteProxyUrl, {
            skip_setup: true,
        });

        return remoteDb.current
    }

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        createRemote();
    }, [isAuthenticated]);

    const performSync = async () => {
        if (!remoteDb.current) {
            throw new Error('Remote database is not connected');
        }

        db.sync(remoteDb.current).then((info) => {
            console.log('Sync complete', info);
        });
    }

    const sync = async () => {
        performSync();
    }

    const context: RemoteContext = {
        syncError,
        sync,
        authenticationStatus: userSession.status,
    };

    return (
        <RemoteContext.Provider value={context}>
            {props.children}
        </RemoteContext.Provider>
    )
}
