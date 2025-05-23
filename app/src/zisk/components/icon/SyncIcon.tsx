import { SyncStatusEnum } from '@/contexts/RemoteContext'
import { Bedtime, CloudDone, CloudOff, Computer, Sync, SyncProblem } from '@mui/icons-material'
import { CircularProgress } from '@mui/material'

interface SyncIconProps extends Record<any, any> {
  syncStatus: SyncStatusEnum
}

export default function SyncIcon(props: SyncIconProps) {
  const { syncStatus, ...rest } = props

  switch (syncStatus) {
    case SyncStatusEnum.SAVING:
    case SyncStatusEnum.CONNECTING_TO_REMOTE:
      return <Sync {...rest} />
    case SyncStatusEnum.SAVED_TO_REMOTE:
      return <CloudDone {...rest} />
    case SyncStatusEnum.WORKING_OFFLINE:
      return <CloudOff {...rest} />
    case SyncStatusEnum.WORKING_LOCALLY:
    case SyncStatusEnum.SAVED_TO_THIS_DEVICE:
      return <Computer {...rest} />
    case SyncStatusEnum.FAILED_TO_SAVE:
    case SyncStatusEnum.FAILED_TO_CONNECT:
      return <SyncProblem {...rest} />
    case SyncStatusEnum.IDLE:
      return <Bedtime />
    default:
      break
  }

  return <CircularProgress size={16} />
}
