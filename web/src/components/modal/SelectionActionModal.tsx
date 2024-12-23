import { Delete } from "@mui/icons-material"
import {
    Button,
    Checkbox,
    Divider,
    Fade,
    IconButton,
    Paper,
    Popper,
    Stack,
    Typography
} from "@mui/material"

interface SelectionActionModalActions {
    onDelete: () => void
}

interface SelectionActionModalProps {
    anchorEl: Element | null
    open: boolean
    numSelected: number
    numTotalSelectable: number
    onSelectAllChange: () => void
    actions?: SelectionActionModalActions
}

export default function SelectionActionModal(props: SelectionActionModalProps) {
    return (
        <Popper
            open={props.open}
            anchorEl={props.anchorEl}
            style={{ zIndex: 10000 }}
            transition
            placement="top-start"
        >
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                    <Paper>
                        <Stack
                            direction='row'
                            alignItems={'center'}
                            sx={{
                                'button:not(.MuiIconButton-root):not(:first-child)': {
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                },
                                'button:not(.MuiIconButton-root):not(:last-child)': {
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0,
                                },
                            }}
                        >
                            <Button
                                onClick={() => props.onSelectAllChange()}
                                sx={{ gap: 1 }}
                                tabIndex={-1}
                                disableFocusRipple
                            >
                                {/* <Stack direction='row' gap={1} px={1} alignItems='center'> */}
                                    <Checkbox
                                        indeterminate={props.numSelected > 0 && props.numSelected < props.numTotalSelectable}
                                        checked={props.numSelected > 0 && props.numSelected === props.numTotalSelectable}
                                        disabled={props.numTotalSelectable <= 0}
                                        sx={{ mx: -1 }}
                                        disableTouchRipple
                                    />
                                    <Typography color='inherit'>{props.numSelected} selected</Typography>
                                {/* </Stack> */}
                            </Button>
                            {props.actions?.onDelete && (
                                <>
                                    <Divider orientation="vertical" flexItem />
                                    <IconButton onClick={() => props.actions?.onDelete()}>
                                        <Delete />
                                    </IconButton>
                                </>
                            )}                            
                        </Stack>
                    </Paper>
                </Fade>
            )}
        </Popper>
    )
}
