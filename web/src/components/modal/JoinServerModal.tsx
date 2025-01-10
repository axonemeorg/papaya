import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    DialogProps, 
    ToggleButtonGroup,
    ToggleButton,
    Button,
    Stack,
    TextField
} from "@mui/material";
import { useState } from "react";
import ServerWidget from "../settings/widget/ServerWidget";

interface JoinServerModalProps extends DialogProps {}

export default function JoinServerModal(props: JoinServerModalProps) {
    const [serverUrl, setServerUrl] = useState<string>('https://zisk.ax0ne.me')
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [serverNickname, setServerNickname] = useState<string>('')

    const serverName = 'myserver'

    return (
        <Dialog {...props} fullWidth maxWidth={'sm'}>
            <DialogTitle>Join Server</DialogTitle>
            <DialogContent>
                <ToggleButtonGroup>
                    <ToggleButton disabled>
                        Zisk Cloud
                    </ToggleButton>
                    <ToggleButton>
                        Zisk Server
                    </ToggleButton>
                </ToggleButtonGroup>
                <DialogContentText>
                    Text.
                </DialogContentText>
                <Stack mt={2} gap={1}>
                    <TextField
                        value={serverUrl}
                        onChange={(event) => setServerUrl(event.target.value)}
                        label='Server URL'
                        placeholder='your.server.com'
                        fullWidth
                        required
                    />
                    <ServerWidget
                        serverName={serverName}
                        serverNickname={serverNickname}
                        serverUrl={serverUrl}
                        userName={username}
                        status="alright"
                        version="1.1.1.1"
                    />
                    <TextField
                        label='Username'
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        label='Password'
                        type='password'
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        label='Server Display Name (Optional)'
                        value={serverNickname}
                        onChange={(event) => setServerNickname(event.target.value)}
                        fullWidth
                        placeholder={serverName}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose?.()}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}
