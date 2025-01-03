import { Alert, AlertTitle, Button, FormControl, FormHelperText, Grid2 as Grid, InputLabel, Link, Paper, Radio, Select, Stack, TextField, Typography } from "@mui/material"
import SettingsSectionHeader from "./SettingsSectionHeader"
import React, { useContext, useState } from "react"
import { SyncingStrategy } from "@/types/schema"
import { ZiskContext } from "@/contexts/ZiskContext"
import CustomSyncWizardModal from "../modal/CustomSyncWizardModal"
import { Add, Cloud } from "@mui/icons-material"

const POUCH_DB_DOCS_URL = 'https://pouchdb.com/'
const ZISK_SERVER_DOCS_URL = 'https://github.com/curtisupshall/zisk/tree/master/server'

export default function SyncingSettings() {
    const ziskContext = useContext(ZiskContext)
    const [showCustomSyncWizardModal, setShowCustomSyncWizardModal] = useState<boolean>(false)
    if (!ziskContext.data) {
        return React.Fragment;
    }
    
    const ziskServer = ziskContext.data.settings.server
    const syncStrategy: SyncingStrategy = ziskContext.data.settings.syncingStrategy

    const handleSwitchToLocal = () => {

    }

    const handleSwitchToCustomServer = () => {
        setShowCustomSyncWizardModal(true)
    }

    return (
        <>
            <CustomSyncWizardModal
                open={showCustomSyncWizardModal}
                onClose={() => setShowCustomSyncWizardModal(false)}
            />
            <Stack spacing={4}>
                <section>
                    <SettingsSectionHeader title='Your Server' />
                    <Typography variant='body2' color='textSecondary' mb={2}>
                        Zisk Server is an optional web server for syncing and analyzing your Zisk journal. Data replication is automatically implemented using CouchDB, but you can host your own instance of CouchDB. You may also choose not to connect to a server, and your data will only persist on your device.
                    </Typography>
                    {ziskServer.serverType === 'NONE' && (
                        <Alert severity="info" sx={{ mb: 2 }}>You are not currently using a Zisk Server</Alert>
                    )}
                    <Stack gap={3} mb={4}>
                        <Stack direction='row' alignItems={'flex-start'} gap={1}>
                            <Radio
                                checked={ziskServer.serverType === 'ZISK_CLOUD'}
                                disableRipple
                                disableFocusRipple
                                disableTouchRipple
                                sx={{ my: -1.5 }}
                            />
                            <Stack sx={{ flex: 1, alignItems: 'flex-start' }}>
                                <Stack direction='row' gap={1} alignItems={'center'}>
                                    <Typography sx={{ lineHeight: 1, mb: 0.5 }}>Zisk Cloud</Typography>
                                    <Cloud />
                                </Stack>
                                <Typography variant='body2' color='textSecondary' mb={2}>
                                    Zisk Cloud is a managed server.
                                </Typography>
                                {ziskServer.serverType === 'ZISK_CLOUD' ? (
                                    // <Paper variant='outlined' sx={{ p: 1 }}>
                                    //     <Typography variant='caption'>Server URL</Typography>
                                    // </Paper>
                                    <Alert sx={{ mt: 1 }} severity="success">You are using Zisk Cloud</Alert>
                                ) : (
                                    <Button variant='contained'>Sign In to Zisk Cloud</Button>
                                )}
                            </Stack>
                        </Stack>
                    </Stack>
                    <Typography mb={1}>Add a Server</Typography>
                    <form onSubmit={() => {}}>
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
                                <Button
                                    type='submit'
                                    startIcon={<Add />}
                                    variant='contained'
                                >
                                    Connect
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </section>
                <section>
                    <SettingsSectionHeader title='Syncing Strategy' />
                    <Typography variant="body2" color='textSecondary' mb={2}>
                        Zisk uses <Link href={POUCH_DB_DOCS_URL}>PouchDB</Link> to store your journals. If you're connected to a Zisk Server, it can be used to sync your journals. You can also sync your journals using your own CouchDB server, or just store them on this device only.
                    </Typography>
                    <Stack gap={3}>
                        <Stack direction='row' alignItems={'flex-start'} gap={1}>
                            <Radio
                                checked={syncStrategy.strategyType === 'CUSTOM_SERVER_OR_ZISK_CLOUD' }
                                disableRipple
                                disableFocusRipple
                                disableTouchRipple
                                sx={{ my: -1.5 }}
                            />
                            <Stack sx={{ flex: 1, alignItems: 'flex-start' }}>
                                <Typography sx={{ lineHeight: 1, mb: 0.5 }}>Zisk Server</Typography>
                                <Typography variant='body2' color='textSecondary' mb={2}>
                                    Your journals will be synced with the Zisk Server you've selected above.
                                </Typography>

                                <Grid container columns={12} alignItems={'center'} gap={1}>
                                    <Grid size='grow'>
                                        <FormControl fullWidth variant="filled" sx={{ minWidth: 120 }}>
                                            <InputLabel id="sync-server-select-label">Server</InputLabel>
                                            <Select
                                                labelId="sync-server-select-label"
                                                label='Server'
                                                variant='filled'
                                                size='small'
                                            >
                                                <option value='ZISK_CLOUD'>Zisk Cloud</option>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size='auto'>
                                        <Button
                                            type='submit'
                                            startIcon={<Add />}
                                            variant='contained'
                                            disabled
                                        >
                                            Switch
                                        </Button>
                                    </Grid>
                                </Grid>
                                {/* {ziskServer.serverType === 'ZISK_CLOUD' ? (
                                    // <Paper variant='outlined' sx={{ p: 1 }}>
                                    //     <Typography variant='caption'>Server URL</Typography>
                                    // </Paper>
                                    <Alert sx={{ mt: 1 }} severity="success">You are using Zisk Cloud</Alert>
                                ) : (
                                    <Button variant='contained'>Sign In to Zisk Cloud</Button>
                                )} */}
                            </Stack>
                        </Stack>
                        <Stack direction='row' alignItems={'flex-start'} gap={1}>
                            <Radio
                                checked={syncStrategy.strategyType === 'LOCAL' }
                                disableRipple
                                disableFocusRipple
                                disableTouchRipple
                                sx={{ my: -1.5 }}
                            />
                            <Stack sx={{ flex: 1, alignItems: 'flex-start' }}>
                                <Typography sx={{ lineHeight: 1, mb: 0.5 }}>Local</Typography>
                                <Typography variant='body2' color='textSecondary' mb={2}>
                                    Your content is stored locally.
                                </Typography>
                                {syncStrategy.strategyType === 'LOCAL' ? (
                                    <Alert severity="success">Your data is being stored locally</Alert>
                                ) : (
                                    <Button
                                        onClick={() => {}}
                                        variant='contained'
                                    >
                                        Switch to Local Sync
                                    </Button>
                                )}
                            </Stack>
                        </Stack>
                        <Stack direction='row' alignItems={'flex-start'} gap={1}>
                            <Radio
                                checked={syncStrategy.strategyType === 'COUCH_DB' }
                                disableRipple
                                disableFocusRipple
                                disableTouchRipple
                                sx={{ my: -1.5 }}
                            />
                            <Stack sx={{ flex: 1, alignItems: 'flex-start' }}>
                                <Typography sx={{ lineHeight: 1, mb: 0.5 }}>Custom CouchDB</Typography>
                                <Typography variant='body2' color='textSecondary' mb={2}>
                                    Your content is stored in your own CouchDB instance.
                                </Typography>
                                <form onSubmit={() => {}}>
                                    <Grid container columns={12} alignItems={'center'} gap={1}>
                                        <Grid size='grow'>
                                            <TextField
                                                fullWidth
                                                label='CouchDB URL'
                                                name='couchdb-url'
                                                size='small'
                                                variant='filled'
                                            />
                                        </Grid>
                                        <Grid size='auto'>
                                            <Button
                                                type='submit'
                                                startIcon={<Add />}
                                                variant='contained'
                                            >
                                                Connect
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <FormHelperText>
                                        Include the port number and database name
                                    </FormHelperText>
                                </form>
                            </Stack>
                        </Stack>
                    </Stack>
                </section>
            </Stack>
        </>
    )
}