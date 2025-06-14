import { Alert, NotificationsContext } from '@/contexts/NotificationsContext'
import { Close, Warning } from '@mui/icons-material'
import { AlertTitle, IconButton, Alert as MuiAlert, Stack } from '@mui/material'
import { useContext } from 'react'

interface AlertBannerProps {
    alert: Alert
    onDismiss: (id: string) => void
}

const AlertBannerItem = ({ alert, onDismiss }: AlertBannerProps) => {
    return (
        <MuiAlert
            severity="warning"
            icon={<Warning />}
            action={
                alert.promptDismissal ? (
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => onDismiss(alert.id)}
                    >
                        <Close fontSize="inherit" />
                    </IconButton>
                ) : undefined
            }
            sx={{
                width: '100%',
                '& .MuiAlert-message': {
                    width: '100%',
                },
            }}
        >
            <AlertTitle>{alert.title}</AlertTitle>
            {alert.description}
        </MuiAlert>
    )
}

export default function AlertBanner() {
    const { activeAlerts, dismissAlert } = useContext(NotificationsContext)

    if (activeAlerts.length === 0) {
        return null
    }

    return (
        <Stack spacing={1} sx={{ width: '100%' }}>
            {activeAlerts.map((alert) => (
                <AlertBannerItem
                    key={alert.id}
                    alert={alert}
                    onDismiss={dismissAlert}
                />
            ))}
        </Stack>
    )
} 