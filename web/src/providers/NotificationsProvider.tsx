"use client";

import { DialogNotification, NotificationsContext, SnackbarAction, SnackbarNotification } from "@/contexts/NotificationsContext";
import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Snackbar } from "@mui/material";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";

const renderAction = (action: SnackbarAction) => {
	return (
		<Button onClick={() => action.onClick()}>
			{action.label}	
		</Button>
	)
}

const NotificationsProvider = (props: PropsWithChildren) => {
	const [dialogNotification, setDialogNotification] = useState<DialogNotification | null>(null);
	const [snackbarNotification, setSnackbarNotification] = useState<SnackbarNotification | null>(null);

	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

	const snackbar = useCallback((notification: SnackbarNotification) => {
		setSnackbarNotification(notification);
		setSnackbarOpen(true);
	}, []);

	const dialog = useCallback((notification: DialogNotification): void => {
		setDialogNotification(notification);
		setDialogOpen(true);
	}, []);

	const handleCloseDialog = useCallback(() => {
		setDialogOpen(false);
		dialogNotification?.onClose?.();
	}, []);

	const handleCloseSnackbar = () => {
		setSnackbarOpen(false);
	}

	const contextValue = useMemo(() => ({
		snackbar,
		dialog,
	}), [snackbar, dialog])

	return (
		<NotificationsContext.Provider value={contextValue}>
			{props.children}
			<Dialog
				open={dialogOpen && Boolean(dialogNotification)}
				onClose={() => handleCloseDialog()}
				maxWidth='sm'
				fullWidth
			>
				<DialogTitle>{dialogNotification?.dialogTitle}</DialogTitle>
				<DialogContent>
					<DialogContentText>{dialogNotification?.message}</DialogContentText>
					<DialogActions>
						<Button onClick={() => handleCloseDialog()} variant="contained">OK</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={6000} // 6s
				onClose={handleCloseSnackbar}
				action={(
					<>
						{snackbarNotification?.action && renderAction(snackbarNotification.action)}
						<IconButton
							size="small"
							aria-label="close"
							onClick={() => handleCloseSnackbar()}
							color='inherit'
						>
							<Close />
						</IconButton>
					</>
				)}
				message={snackbarNotification?.message}
			/>

		</NotificationsContext.Provider>
	);
}

export default NotificationsProvider;
