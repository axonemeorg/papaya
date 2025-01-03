import { LoadingButton } from "@mui/lab";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, Grid2 as Grid, Link, Stack, TextField, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import { ServerUrl } from "../text/ServerUrl";

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
    const [serverUrl, setServerUrl] = useState<string>("http://localhost:5984")
    const [databaseName, setDatabaseName] = useState<string>('')
    const [serverCheckError, setServerCheckError] = useState<string | null>(null)
    const [serverCheckLoading, setServerCheckLoading] = useState<boolean>(false)
    const [databaseCheckError, setDatabaseCheckError] = useState<string | null>(null)
    const [databaseApproved, setDatabaseApproved] = useState<boolean>(false)
    const [databaseExists, setDatabaseExists] = useState<boolean>(false)
    const [connectionError, setConnectionError] = useState<string | null>(null)
    const [connectionLoading, setConnectionLoading] = useState<boolean>(false)

    const handleCheckDatabase = async () => {
        if (!isAbsoluteUrl(serverUrl)) {
            console.log('Invalid URL')
            setServerCheckError('Please enter a valid URL')
            return
        }
        if (!databaseName) {
            console.log('Invalid Database Name')
            setDatabaseCheckError('Please enter a database name')
            return
        }
        setServerCheckError(null)
        setServerCheckLoading(true)
        setDatabaseApproved(false)
        
        fetch(`${serverUrl}/_up`, {
            method: 'GET',
        }).then(() => {
            console.log('Server is up')
            return fetch(`${serverUrl}/${databaseName}`, {
                method: 'GET',
            }).then(() => {
                setDatabaseExists(false)
                setDatabaseApproved(true)
            }).catch((error) => {
                if (error.status === 404) {
                    setDatabaseExists(true)
                    setDatabaseApproved(true)
                } else {
                    setDatabaseCheckError('Failed to check database')
                }
            })
        })
        .catch((error) => {
            console.error('Health check failed with error:', error);
            setServerCheckError('Health check on the server failed. Please check the server URL and try again.');
        })
        .finally(() => {
            setServerCheckLoading(false)
        })
    }


    const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        setServerUrl(e.target.value)
        // setUrlIsApproved(false)
        setServerCheckError(null)
    }

    const handleChangeDatabaseName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDatabaseName(e.target.value)
        // setDatabaseIsApproved(false)
        setDatabaseCheckError(null)
    }

    const handleConnect = async () => {
        setConnectionLoading(true)
        //
    }

    return (
        <Dialog {...props} fullWidth maxWidth='md'>
            <DialogTitle>Custom Server Syncing</DialogTitle>
        
            <DialogContent>
                <Stack gap={1}>
                    <DialogContentText>A Custom Server will allow you to sync your journals.</DialogContentText>
                    {/* <Alert severity="info">
                        You will need a <Link>compatible version</Link> of CouchDB.
                    </Alert> */}
                    {databaseApproved ? (
                        <>
                            <ServerUrl serverUrl={[serverUrl, databaseName].filter(Boolean).join('/')} />  
                            {databaseExists ? (
                                <Alert severity="warning">Database already exists. You can connect to it.</Alert>
                            
                            ) : (
                                <Alert severity="success">Database is OK!</Alert>
                            )}
                            <Button sx={{ alignSelf: 'flex-start' }} onClick={() => setDatabaseApproved(false)}>Change Database</Button>
                        </>
                    ) : (

                        <>
                            <Grid container columns={12} spacing={1}>
                                <Grid size={7}>
                                    <TextField
                                        label="Server URL"
                                        placeholder="http://myserver.com:5984"
                                        fullWidth
                                        variant="filled"
                                        autoComplete="off"
                                        value={serverUrl}
                                        onChange={handleChangeUrl}
                                        error={Boolean(serverCheckError)}
                                        // color={urlIsApproved ? 'success' : (serverCheckError ? 'error' : undefined)}
                                        // helperText={serverCheckError ?? (urlIsApproved ? 'Server OK!' : undefined)}
                                    />
                                </Grid>
                                <Grid size={5}>
                                    <TextField
                                        label="Database Name"
                                        value={databaseName}
                                        onChange={handleChangeDatabaseName}
                                        fullWidth
                                        variant="filled"
                                        autoComplete="off"
                                        error={Boolean(databaseCheckError)}
                                        // helperText={databaseCheckError ?? (databaseIsApproved ? 'Database OK!' : undefined)}
                                    />
                                </Grid>
                            </Grid>
                            <LoadingButton
                                variant='contained'
                                sx={{ alignSelf: 'flex-start' }}
                                loading={serverCheckLoading}
                                onClick={() => handleCheckDatabase()}
                            >
                                Check Database
                            </LoadingButton>
                        </>
                    )}

                    {/* <ToggleButtonGroup
                        value={setupMode}
                        exclusive
                        orientation="vertical"
                        onChange={(_e, value) => setSetupMode(value)}
                    >
                        <RadioToggleButton
                            value="auto"
                            heading="Auto"
                            description="We'll try to set up your server automatically."
                        />
                        <RadioToggleButton
                            value="manual"
                            heading="Manual"
                            description="You'll need to set up your database and admin credentials manually."
                        />
                    </ToggleButtonGroup> */}
                    <Grid container columns={12} spacing={1}>
                        <Grid size={6}>
                            <TextField
                                label="Username"
                                name='server-username'
                                fullWidth
                                variant="filled"
                                autoComplete="off"
                                slotProps={{
                                    input: {
                                        autoComplete: 'off',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid size={6}>
                            <TextField
                                label="Password"
                                name='server-password'
                                fullWidth
                                variant="filled"
                                autoComplete="off"
                                type="password"
                                slotProps={{
                                    input: {
                                        autoComplete: 'off',
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                </Stack>
            </DialogContent>
            <DialogActions>
                <LoadingButton
                    disabled={!databaseApproved}
                    loading={connectionLoading}
                    onClick={handleConnect}
                >Connect</LoadingButton>
            </DialogActions>
        </Dialog>
    )
}