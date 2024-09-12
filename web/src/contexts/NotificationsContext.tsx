import { createContext } from "react";

interface Notification {
	message: string;
}

export interface SnackbarAction {
	label: string;
	onClick: () => void;
}

export interface SnackbarNotification extends Notification {
	action?: SnackbarAction;
}

export interface DialogNotification extends Notification {
	dialogTitle: string;
	onClose?: () => void;
}

export interface NotificationsContext {
	snackbar: (notification: SnackbarNotification) => void;
	dialog: (notification: DialogNotification) => void;
}

export const NotificationsContext = createContext<NotificationsContext>({
	snackbar: () => {},
	dialog: () => {},
});
