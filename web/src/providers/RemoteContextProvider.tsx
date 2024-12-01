import { RemoteContext } from "@/contexts/RemoteContext";
import { getSession, useSession } from "next-auth/react";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import PouchDB from 'pouchdb';
import { db } from "@/database/client";

export default function RemoteContextProvider(props: PropsWithChildren) {
    const [syncError, setSyncError] = useState<string | null>(null);

    // Create a ref for storing the PouchDB remote database.
    const remoteDb = useRef<PouchDB.Database | null>(null);

    const userSession = useSession();

    useEffect(() => {
        if (userSession.status !== 'authenticated') {
            return;
        }

        const databaseName = 'zisk-2'
        const remoteUrl = `${process.env.NEXT_PUBLIC_REMOTE_DB_PROXY_PATH}/${databaseName}`;
        console.log('user session', userSession);

        remoteDb.current = new PouchDB(
            remoteUrl,
            {
                fetch: (url, opts) => {
                    // if (opts) {
                    //     opts.xs = 'include';
                    // }
                    console.log('Connecting to remote at:', remoteUrl);
                    return PouchDB.fetch(url, opts);
                }
            });
    }, [userSession.status]);

    const sync = async () => {
        console.log('initiating sync')
        if (!remoteDb.current) {
            console.log('Remote database is null.')
            // throw new Error('Remote database is not connected');
            // TODO
            return;
        }

        console.log('performing sync')
        remoteDb.current.sync(db).then((info) => {
            console.log('Sync complete', info);
        });
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
