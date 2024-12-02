import { createContext } from "react";

export enum SyncStatusEnum {
    SAVING = 'SAVING',
    CONNECTING_TO_REMOTE = 'CONNECTING_TO_REMOTE',
    FAILED_TO_CONNECT = 'FAILED_TO_CONNECT',
    SAVED_TO_REMOTE = 'SAVED_TO_REMOTE',
    WORKING_OFFLINE = 'WORKING_OFFLINE',
    WORKING_LOCALLY = 'WORKING_LOCALLY',
    SAVED_TO_THIS_DEVICE = 'SAVED_TO_THIS_DEVICE',
    FAILED_TO_SAVE = 'FAILED_TO_SAVE',
    IDLE = 'IDLE'
}

export interface RemoteContext {
    syncError: string | null;
    syncStatus: SyncStatusEnum;
    isAuthenticated: boolean;
    sync: () => Promise<void>;
}

export const RemoteContext = createContext<RemoteContext>({} as RemoteContext);
