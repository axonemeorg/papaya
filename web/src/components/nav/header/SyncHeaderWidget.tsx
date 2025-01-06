'use client'

import { RemoteContext, SyncStatusEnum } from '@/contexts/RemoteContext'
import { CloudDone, CloudOff, Computer, Sync, SyncProblem } from '@mui/icons-material'
import {
	Button,
	CardActions,
	CardHeader,
	CircularProgress,
	Divider,
	Grow,
	IconButton,
	LinearProgress,
	Popover,
	Stack,
	SvgIconOwnProps,
	Typography,
} from '@mui/material'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

type IconColor = SvgIconOwnProps['color']

export default function SyncHeaderWidget() {
	const [verbose, setVerbose] = useState<boolean>(false)
	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const buttonAnchorRef = useRef<HTMLDivElement>(null);

	const remoteContext = useContext(RemoteContext)
	const { syncStatus } = remoteContext
	const isIdle = syncStatus === SyncStatusEnum.IDLE

	const { syncStatusTitle, syncStatusDescription } = useMemo(() => {
		switch (syncStatus) {
			case SyncStatusEnum.CONNECTING_TO_REMOTE:
				return {
					syncStatusTitle: 'Connecting to remote...',
					syncStatusDescription: 'Waiting to establish connection with remote database',
				}
			case SyncStatusEnum.FAILED_TO_CONNECT:
				return {
					syncStatusTitle: 'Failed to connect',
					syncStatusDescription: 'Failed to establish connection with remote database',
				}
			case SyncStatusEnum.SAVING:
				return {
					syncStatusTitle: 'Syncing...',
					syncStatusDescription: 'Pulling and pushing changes to remote database',
				}
			case SyncStatusEnum.SAVED_TO_REMOTE:
				return {
					syncStatusTitle: 'Saved to remote',
					syncStatusDescription: 'Your changes have been saved to the remote database',
				}
			case SyncStatusEnum.WORKING_OFFLINE:
				return {
					syncStatusTitle: 'Working offline',
					syncStatusDescription:
						'Your device is currently offline. Changes will be synced when you are back online',
				}
			case SyncStatusEnum.SAVED_TO_THIS_DEVICE:
				return {
					syncStatusTitle: 'Saved to this device',
					syncStatusDescription:
						'Your changes have been saved locally, but need to be synced to the remote database',
				}
			case SyncStatusEnum.WORKING_LOCALLY:
				return {
					syncStatusTitle: 'Working locally',
					syncStatusDescription: 'All changes will be maintained locally',
				}
			case SyncStatusEnum.FAILED_TO_SAVE:
				return {
					syncStatusTitle: 'Failed to save',
					syncStatusDescription: 'Failed to save changes to the remote database',
				}
			case SyncStatusEnum.IDLE:
			default:
				return {
					syncStatusTitle: 'Idle',
					syncStatusDescription: 'No changes to sync',
				}
		}
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

	const ButtonIcon = useCallback(
		(IconProps: any) => {
			switch (syncStatus) {
				case SyncStatusEnum.SAVING:
				case SyncStatusEnum.CONNECTING_TO_REMOTE:
					return <Sync {...IconProps} />
				case SyncStatusEnum.SAVED_TO_REMOTE:
					return <CloudDone {...IconProps} />
				case SyncStatusEnum.WORKING_OFFLINE:
					return <CloudOff {...IconProps} />
				case SyncStatusEnum.WORKING_LOCALLY:
				case SyncStatusEnum.SAVED_TO_THIS_DEVICE:
					return <Computer {...IconProps} />
				case SyncStatusEnum.FAILED_TO_SAVE:
				case SyncStatusEnum.FAILED_TO_CONNECT:
					return <SyncProblem {...IconProps} />
				case SyncStatusEnum.IDLE:
				default:
					break
			}

			return <CircularProgress size={16} />
		},
		[syncIconVerboseColor, verbose, syncStatus]
	)

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

	const handleSync = () => {
		remoteContext.sync()
	}

	const handleOpen = () => {
		setVerbose(true)
		setModalOpen(true)
	}

	const isLoading = [SyncStatusEnum.SAVING, SyncStatusEnum.CONNECTING_TO_REMOTE].includes(syncStatus)
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
				<CardHeader
					avatar={<ButtonIcon sx={{ transition: 'all 0.3s' }} />}
					title={syncStatusTitle}
					subheader={syncStatusDescription}
				/>
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
			</Popover>
			<Stack direction="row" alignItems="center" gap={0} ref={buttonAnchorRef}>
				<Grow in={showButton}>
					<IconButton
						onClick={handleOpen}
						sx={(theme) => ({
							color: theme.palette.text.secondary,
						})}
					>
						<ButtonIcon
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
