'use client'

import { RemoteContext, SyncStatusEnum } from '@/contexts/RemoteContext'
import {
    Box,
	Button,
	CardActions,
	CardHeader,
	Divider,
	LinearProgress,
} from '@mui/material'
import { useContext, useMemo } from 'react'
import SyncIcon from '../icon/SyncIcon'
import { getSyncStatusTitles } from '@/utils/string'

const ENABLE_SYNC_DEBUGGING = process.env.NEXT_PUBLIC_SYNC_DEBUGGING === 'true'

export default function SyncWidget() {
	const remoteContext = useContext(RemoteContext)
	const { syncStatus } = remoteContext

	const { syncStatusTitle, syncStatusDescription } = useMemo(() => {
		return getSyncStatusTitles(syncStatus)
	}, [syncStatus])

	const handleSync = () => {
		remoteContext.sync()
	}

	const isLoading = [SyncStatusEnum.SAVING, SyncStatusEnum.CONNECTING_TO_REMOTE].includes(syncStatus)

	return (
		<Box>
			
            <CardHeader
                avatar={<SyncIcon syncStatus={syncStatus} sx={{ transition: 'all 0.3s' }} />}
                title={syncStatusTitle}
                subheader={syncStatusDescription}
            />
            {(ENABLE_SYNC_DEBUGGING && remoteContext.syncError) && (
                <pre>
                    {remoteContext.syncError}
                </pre>
            )}
            {remoteContext.syncSupported && (
                <>
                    {isLoading ? (
                        <LinearProgress variant="indeterminate" />
                    ) : (
                        <Divider sx={{ height: '1px', my: '1.5px' }} />
                    )}
                    <CardActions>
                        <Button onClick={handleSync}>Sync Now</Button>
                    </CardActions>
                </>
            )}
			
		</Box>
	)
}
