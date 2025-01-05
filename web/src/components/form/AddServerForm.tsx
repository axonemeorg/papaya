import { Add } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid2 as Grid, Stack, TextField } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";

interface AddServerFormProps {
    //
}

export default function AddServerForm(props: AddServerFormProps) {
    const [showLoginDialog, setShowLoginDialog] = useState<boolean>(false);
    const [loginServerUrl, setLoginServerUrl] = useState<string | null>(null);
    const [versionData, setVersionData] = useState<Record<string, string | null | undefined> | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        setLoading(true);
        setError(null);
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const serverUrl = formData.get('add-server-url') as string;
        fetchtVersionData(serverUrl)
    }

    const handleLogInSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget)
        const name = formData.get('login-username') as string
        const password = formData.get('login-password') as string
        logInToServer({ name, password })
    }

    const logInToServer = async (credentials: any) => {
        const couchDbLoginUrl = `${loginServerUrl}/database/_session`;

        // Send username and password as form parameters
        const response = await fetch(couchDbLoginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(credentials),
            credentials: 'include',
        });

        if (response.ok) {
            console.log('Login successful');
        } else {
            console.error('Login failed');
        }
    }

    const fetchtVersionData = async (serverUrl: string) => {
        const versionUrl =  `${serverUrl}/api/`
        console.log('Fetching version data from', versionUrl);
        const response = await fetch(versionUrl);
        if (response.ok) {
            const data = await response.json();
            setVersionData(data);
            setLoginServerUrl(serverUrl);
        } else {
            console.error('Failed to fetch version data');
        }
        setLoading(false);
    }

    const handleCloseLoginDialog = () => {
        setShowLoginDialog(false);
    }

    useEffect(() => {
        if (versionData) {
            setShowLoginDialog(true);
        }
    }, [versionData, loginServerUrl])


    return (
        <>
            <Dialog open={showLoginDialog} onClose={handleCloseLoginDialog}>
                <DialogTitle>Log In to Server</DialogTitle>
                <form onSubmit={handleLogInSubmit}>
                    <DialogContent>
                        <DialogContentText>
                            The server responded with the following version data:
                        </DialogContentText>
                        <pre>
                            {JSON.stringify(versionData, null, 2)}
                        </pre>
                        <Stack spacing={1}>
                            <TextField
                                fullWidth
                                label='Username'
                                name='login-username'
                                size='small'
                                variant='filled'
                            />
                            <TextField
                                fullWidth
                                label='Password'
                                name='login-password'
                                size='small'
                                type='password'
                                variant='filled'
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseLoginDialog}>Cancel</Button>
                        <Button variant='contained' type='submit'>Log In</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <form onSubmit={handleSubmit}>
                <Grid container columns={12} alignItems={'center'} gap={1}>
                    <Grid size='grow'>
                        <TextField
                            fullWidth
                            label='Server URL'
                            name='add-server-url'
                            size='small'
                            variant='filled'
                        />
                    </Grid>
                    <Grid size='auto'>
                        <LoadingButton
                            // loading={loading}
                            type='submit'
                            startIcon={<Add />}
                            variant='contained'
                        >
                            Connect
                        </LoadingButton>
                    </Grid>
                </Grid>
            </form>
        </>
    )
}