import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    DialogProps, 
    ToggleButtonGroup,
    ToggleButton,
    Button
} from "@mui/material";

interface JoinServerModalProps extends DialogProps {}

export default function JoinServerModal(props: JoinServerModalProps) {
    return (
        <Dialog {...props}>
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

                </DialogContentText>
                
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose?.()}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}
