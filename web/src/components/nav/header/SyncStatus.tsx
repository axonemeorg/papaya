'use client';

import { RemoteContext, SyncStatusEnum } from "@/contexts/RemoteContext";
import { CloudDone, CloudOff, CloudSync, Computer, Insights, MoreVert, ReceiptLong, Sync, SyncProblem, UnfoldMore } from "@mui/icons-material";
import { Button, CardActions, CardContent, CardHeader, CircularProgress, Collapse, Divider, Grow, IconButton, IconProps, LinearProgress, ListItemText, Popover, SvgIconOwnProps, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

type IconColor = SvgIconOwnProps['color'];

export default function SyncStatus() {
    const [verbose, setVerbose] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    
    const remoteContext = useContext(RemoteContext);
    const { syncStatus } = remoteContext;
    const isIdle = syncStatus === SyncStatusEnum.IDLE;

    const { syncStatusTitle, syncStatusDescription } = useMemo(() => {
        switch (syncStatus) {
            case SyncStatusEnum.CONNECTING_TO_REMOTE:
                return {
                    syncStatusTitle: 'Connecting to remote...',
                    syncStatusDescription: 'Waiting to establish connection with remote database',
                };
            case SyncStatusEnum.FAILED_TO_CONNECT:
                return {
                    syncStatusTitle: 'Failed to connect',
                    syncStatusDescription: 'Failed to establish connection with remote database',
                };
            case SyncStatusEnum.SAVING:
                return {
                    syncStatusTitle: 'Syncing...',
                    syncStatusDescription: 'Pulling and pushing changes to remote database',
                };
            case SyncStatusEnum.SAVED_TO_REMOTE:
                return {
                    syncStatusTitle: 'Saved to remote',
                    syncStatusDescription: 'Your changes have been saved to the remote database',
                };
            case SyncStatusEnum.WORKING_OFFLINE:
                return {
                    syncStatusTitle: 'Working offline',
                    syncStatusDescription: 'Your device is currently offline. Changes will be synced when you are back online',
                };
            case SyncStatusEnum.SAVED_TO_THIS_DEVICE:
                return {
                    syncStatusTitle: 'Saved to this device',
                    syncStatusDescription: 'Your changes have been saved locally, but need to be synced to the remote database',
                };
            case SyncStatusEnum.WORKING_LOCALLY:
                return {
                    syncStatusTitle: 'Working locally',
                    syncStatusDescription: 'All changes will be maintained locally',
                };
            case SyncStatusEnum.FAILED_TO_SAVE:
                return {
                    syncStatusTitle: 'Failed to save',
                    syncStatusDescription: 'Failed to save changes to the remote database',
                };
            case SyncStatusEnum.IDLE:
                return {
                    syncStatusTitle: 'Idle',
                    syncStatusDescription: 'No changes to sync',
                };
        }
    }, [syncStatus]);

    const syncIconVerboseColor: IconColor = useMemo(() => {
        switch (syncStatus) {
            case SyncStatusEnum.SAVED_TO_REMOTE:
                return 'success';
            case SyncStatusEnum.WORKING_OFFLINE:
                return 'warning';
            case SyncStatusEnum.FAILED_TO_SAVE:
            case SyncStatusEnum.FAILED_TO_CONNECT:
                return 'error';
            case SyncStatusEnum.CONNECTING_TO_REMOTE:
            case SyncStatusEnum.SAVED_TO_THIS_DEVICE:
            case SyncStatusEnum.WORKING_LOCALLY:
            case SyncStatusEnum.IDLE:
            case SyncStatusEnum.SAVING:
            default:
                return undefined;
        }
    }, [syncStatus]);

    const ButtonIcon = useCallback((IconProps: any) => {
        switch (syncStatus) {
            case SyncStatusEnum.SAVING:
            case SyncStatusEnum.CONNECTING_TO_REMOTE:
                return (
                    <Sync { ...IconProps } />
                )
            case SyncStatusEnum.SAVED_TO_REMOTE:
                return (
                    <CloudDone { ...IconProps } />
                )
            case SyncStatusEnum.WORKING_OFFLINE:
                return (
                    <CloudOff { ...IconProps } />
                )
            case SyncStatusEnum.WORKING_LOCALLY:
            case SyncStatusEnum.SAVED_TO_THIS_DEVICE:
                return (
                    <Computer { ...IconProps } />
                )
            case SyncStatusEnum.FAILED_TO_SAVE:
            case SyncStatusEnum.FAILED_TO_CONNECT:
                return (
                    <SyncProblem { ...IconProps } />
                )
            case SyncStatusEnum.IDLE:
            default:
                break;
        }

        return (
            <CircularProgress size={16} />
        );
    }, [syncIconVerboseColor, verbose, syncStatus]);

    useEffect(() => {
        // Whenever sync status changes, set verbose to true, then 3s later set it to false
        setVerbose(true);
        const timeout = setTimeout(() => {
            setVerbose(false);
        }, 5000);
        return () => {
            clearTimeout(timeout);
        }
    }, [syncStatus]);

    const handleSync = () => {
        remoteContext.sync();
    }

    const handleClickButton = (event: React.MouseEvent<HTMLButtonElement>) => {
        setVerbose(true);
        setAnchorEl(event.currentTarget);
    }

    const showingModal = Boolean(anchorEl);

    const isLoading = useMemo(() => {
        return syncStatus === SyncStatusEnum.SAVING || syncStatus === SyncStatusEnum.CONNECTING_TO_REMOTE;
    }, [syncStatus]);

    const canSync = useMemo(() => {
        return remoteContext.authenticationStatus === 'authenticated';
    }, [remoteContext.authenticationStatus]);

    return (
        <>
            <Popover
                anchorEl={anchorEl}
                open={showingModal}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <CardHeader
                    avatar={
                        <ButtonIcon
                            sx={{ transition: 'all 0.3s' }}
                        />
                    }
                    title={syncStatusTitle}
                    subheader={syncStatusDescription}
                />
                {canSync && (
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
            <Grow in={!isIdle}>
                <Button
                    variant='text'
                    onClick={handleClickButton}
                    sx={(theme) => ({
                        color: theme.palette.text.secondary,
                        borderRadius: 16,
                        py: 1,
                        px: 1,
                        gap: 1,
                        justifyContent: 'flex-start',
                        minWidth: 0,
                        '& .MuiButton-icon': {
                            margin: verbose ? undefined : 0,
                        },
                    })}
                >
                    <ButtonIcon
                        fontSize='small'
                        color={verbose ? syncIconVerboseColor : 'inherit'}
                        sx={{ transition: 'all 0.3s' }}
                    />
                    {(verbose || showingModal) && (
                        <Grow in>
                            <Typography variant="caption" sx={{ mr: 1, userSelect: 'none' }}>
                                {syncStatusTitle}
                                {/* <Shortcut>Ctrl</Shortcut> */}
                            </Typography>
                        </Grow>
                    )}
                </Button>
            </Grow>
        </>
    )
}
