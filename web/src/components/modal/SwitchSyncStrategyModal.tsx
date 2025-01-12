import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, ToggleButtonGroup } from "@mui/material";
import RadioToggleButton from "../input/RadioToggleButton";
import { useState } from "react";
import ServerWidget from "../widget/ServerWidget";

type SyncStrategyType = 'LOCAL' | 'CUSTOM_SERVER_OR_ZISK_CLOUD' | 'COUCH_DB'

interface SwitchSyncStrategyModalProps {
    currentStrategy: SyncStrategyType
    open: boolean
    onClose: () => void
}

export default function SwitchSyncStrategyModal(props: SwitchSyncStrategyModalProps) {
    const [strategy, setStrategy] = useState<SyncStrategyType>(props.currentStrategy)

    return (
        <Dialog open={props.open} onClose={() => props.onClose()} fullWidth maxWidth='sm'>
            <DialogTitle>Switch Sync Strategy</DialogTitle>
            <DialogContent>
                <Stack>
                    <ToggleButtonGroup
                        orientation="vertical"
                        exclusive
                        value={strategy}
                        onChange={(_event, newValue) => setStrategy(newValue)}
                    >
                        <RadioToggleButton
                            description="Your data will only be saved locally."
                            heading="Local (No Syncing)"
                            value="LOCAL"
                            selected={strategy === 'LOCAL'}
                        />
                        <RadioToggleButton
                            description="Your data will be synced to and maintained by your Zisk Server."
                            heading="Server"
                            value="CUSTOM_SERVER_OR_ZISK_CLOUD"
                            selected={strategy === 'CUSTOM_SERVER_OR_ZISK_CLOUD'}
                        />
                        <RadioToggleButton
                            description="Your data will be synced with a self-hosted or cloud-hosted instance of CouchDB provided by you."
                            heading="CouchDB"
                            value="COUCH_DB"
                            selected={strategy === 'COUCH_DB'}
                        />
                    </ToggleButtonGroup>
                    {strategy === 'LOCAL' && props.currentStrategy === 'CUSTOM_SERVER_OR_ZISK_CLOUD' && (
                        <Alert severity="info">You'll remain signed into your Zisk Server.</Alert>
                    )}
                    {strategy === 'CUSTOM_SERVER_OR_ZISK_CLOUD' && (
                        <ServerWidget

                        />
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose()}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}
