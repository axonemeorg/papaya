import { createContext } from "react";


export interface RemoteContext {
    syncError: string | null;
    authenticationStatus: 'loading' | 'authenticated' | 'unauthenticated';
    sync: () => Promise<void>;
}

export const RemoteContext = createContext<RemoteContext>({} as RemoteContext);
