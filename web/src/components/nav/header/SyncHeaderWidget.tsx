'use client'

import SyncIcon from '@/components/icon/SyncIcon'
import SyncWidget from '@/components/widget/SyncWidget'
import { RemoteContext, SyncStatusEnum } from '@/contexts/RemoteContext'
import { getSyncStatusTitles } from '@/utils/string'
import {
	Grow,
	IconButton,
	Popover,
	Stack,
	SvgIconOwnProps,
	Typography,
} from '@mui/material'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'

type IconColor = SvgIconOwnProps['color']

export default function SyncHeaderWidget() {
	const [verbose, setVerbose] = useState<boolean>(false)
	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const buttonAnchorRef = useRef<HTMLDivElement>(null);

	const remoteContext = useContext(RemoteContext)
	const { syncStatus } = remoteContext
	const isIdle = syncStatus === SyncStatusEnum.IDLE

	const { syncStatusTitle } = useMemo(() => {
		return getSyncStatusTitles(syncStatus)
	}, [syncStatus])

	const syncIconVerboseColor: IconColor = useMemo(() => {
		switch (syncStatus) {
			case SyncStatusEnum.SAVED_TO_REMOTE:
				return 'success'
			case SyncStatusEnum.WORKING_OFFLINE:
				return 'warning'
			case SyncStatusEnum.FAILED_TO_SAVE:
			case SyncStatusEnum.FAILED_TO_CONNECT:
				return 'error'
			case SyncStatusEnum.CONNECTING_TO_REMOTE:
			case SyncStatusEnum.SAVED_TO_THIS_DEVICE:
			case SyncStatusEnum.WORKING_LOCALLY:
			case SyncStatusEnum.IDLE:
			case SyncStatusEnum.SAVING:
			default:
				return undefined
		}
	}, [syncStatus])

	

	useEffect(() => {
		// Whenever sync status changes, set verbose to true, then 3s later set it to false
		setVerbose(true)
		const timeout = setTimeout(() => {
			setVerbose(false)
		}, 5000)
		return () => {
			clearTimeout(timeout)
		}
	}, [syncStatus])

	const handleOpen = () => {
		setVerbose(true)
		setModalOpen(true)
	}

	const showButton = !isIdle
	const showCaption = verbose || modalOpen

	return (
		<>
			<Popover
				anchorEl={buttonAnchorRef.current}
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}>
				<SyncWidget />
			</Popover>
			<Stack direction="row" alignItems="center" gap={0} ref={buttonAnchorRef}>
				<Grow in={showButton}>
					<IconButton
						onClick={handleOpen}
						sx={(theme) => ({
							color: theme.palette.text.secondary,
						})}
					>
						<SyncIcon
							syncStatus={syncStatus}
							fontSize="small"
							color={verbose ? syncIconVerboseColor : 'inherit'}
							sx={{ transition: 'all 0.3s' }}
						/>
					</IconButton>
				</Grow>
				<Grow in={showCaption}>
					<Typography
						component='a'
						onClick={handleOpen}
						variant="caption"
						sx={{ mr: 1, userSelect: 'none', cursor: 'pointer' }}
					>
						{syncStatusTitle}
						{/* <Shortcut>Ctrl</Shortcut> */}
					</Typography>
				</Grow>
			</Stack>
		</>
	)
}
