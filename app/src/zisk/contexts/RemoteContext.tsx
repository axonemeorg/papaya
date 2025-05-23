import { createContext } from 'react'

export enum SyncStatusEnum {
  SAVING = 'SAVING',
  CONNECTING_TO_REMOTE = 'CONNECTING_TO_REMOTE',
  FAILED_TO_CONNECT = 'FAILED_TO_CONNECT',
  SAVED_TO_REMOTE = 'SAVED_TO_REMOTE',
  WORKING_OFFLINE = 'WORKING_OFFLINE',
  WORKING_LOCALLY = 'WORKING_LOCALLY',
  SAVED_TO_THIS_DEVICE = 'SAVED_TO_THIS_DEVICE',
  FAILED_TO_SAVE = 'FAILED_TO_SAVE',
  IDLE = 'IDLE',
  INITIALIZING = 'INITIALIZING',
}

export enum SyncErrorEnum {
  MISSING_USER_CONTEXT = 'MISSING_USER_CONTEXT',
  MISSING_DATABASE = 'MISSING_DATABASE',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  MISSING_SERVER_URL_IN_CONFIG = 'MISSING_SERVER_URL_IN_CONFIG',
  ZISK_CLOUD_DISABLED = 'ZISK_CLOUD_DISABLED',
}

export interface RemoteContext {
  syncError: SyncErrorEnum | null
  syncStatus: SyncStatusEnum
  syncSupported: boolean
  sync: () => Promise<void>
}

export const RemoteContext = createContext<RemoteContext>({} as RemoteContext)
