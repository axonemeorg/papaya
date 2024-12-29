import { LoadingButton } from "@mui/lab";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, Link, TextField } from "@mui/material";
import { useMemo, useState } from "react";

function isAbsoluteUrl(url: string): boolean {
    try {
      // Use the URL constructor to validate the URL
      const parsedUrl = new URL(url);
  
      // Check if the URL has a valid protocol (http, https, etc.)
      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch {
      // If URL constructor throws an error, the URL is not valid
      return false;
    }
  }

export default function CustomSyncWizardModal(props: DialogProps) {
    const [step, setStep] = useState<number>(0)
    const [serverUrl, setServerUrl] = useState<string>('')
    const [approvedUrl, setApprovedUrl] = useState<string>('')
    const [serverCheckError, setServerCheckError] = useState<string | null>(null)
    const [serverCheckLoading, setServerCheckLoading] = useState<boolean>(false)

    const handleCheckUrl = async () => {
        if (!isAbsoluteUrl(serverUrl)) {
            console.log('Invalid URL')
            setServerCheckError('Please enter a valid URL')
            return
        }
        setServerCheckError(null)
        setServerCheckLoading(true)
        try {
            const response = await fetch(`${serverUrl}/_up`, {
                method: 'GET',
            })

            console.log(response)
        
            if (!response.ok) {
                setServerCheckError(`Health check failed with status: ${response.status}`)
            } else {
                setApprovedUrl(serverUrl)
            }
        } catch (error: any) {
            console.error('Health check failed with error:', error);
            setServerCheckError('Health check on the server failed. Please check the server URL and try again.');
        } finally {
            setServerCheckLoading(false)
        }
    }

    const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        setServerUrl(e.target.value)
        setServerCheckError(null)
    }

    const handleNext = () => {
        setStep(step + 1)
    }

    const handleBack = () => {
        setStep(step - 1)
    }

    const serverIsApproved = useMemo(() => {
        return !serverCheckError && Boolean(serverUrl) && serverUrl === approvedUrl
    }, [serverUrl, approvedUrl])

    const disableNext = useMemo(() => {
        return step === 0 && (!serverIsApproved)
    }, [step, serverUrl, serverCheckError, approvedUrl, serverIsApproved])

    return (
        <Dialog {...props}>
            <DialogTitle>Custom Server Syncing</DialogTitle>
            {step === 0 && (
                <DialogContent>
                    <DialogContentText>A Custom Server will allow you to sync your journals.</DialogContentText>
                    <Alert severity="info">
                        You will need a <Link>compatible version</Link> of CouchDB.
                    </Alert>
                    <TextField
                        label="Server URL"
                        placeholder="http://myserver.com:5984"
                        fullWidth
                        variant="filled"
                        autoComplete="off"
                        value={serverUrl}
                        onChange={handleChangeUrl}
                        color={serverIsApproved ? 'success' : (serverCheckError ? 'error' : undefined)}
                        helperText={serverCheckError ?? undefined}
                    />
                    <LoadingButton loading={serverCheckLoading} onClick={handleCheckUrl}>Check Status</LoadingButton>
                </DialogContent>
            )}
            <DialogActions>
                {step > 0 && (
                    <Button onClick={handleBack}>Back</Button>
                )}
                <Button onClick={handleNext} disabled={disableNext}>Next</Button>
            </DialogActions>
        </Dialog>
    )
}