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
    Tooltip,
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
    actions?: SelectionActionModalActions
    onSelectAll: () => void
    onDeselectAll: () => void
}

export default function SelectionActionModal(props: SelectionActionModalProps) {
    const handleSelectAllChange = () => {
        if (props.numSelected === props.numTotalSelectable) {
            props.onDeselectAll()
        } else {
            props.onSelectAll()
        }
    }

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
                                onClick={() => handleSelectAllChange()}
                                sx={{ gap: 1, px: 2 }}
                                tabIndex={-1}
                                disableFocusRipple
                            >
                                <Checkbox
                                    indeterminate={props.numSelected > 0 && props.numSelected < props.numTotalSelectable}
                                    checked={props.numSelected > 0 && props.numSelected === props.numTotalSelectable}
                                    disabled={props.numTotalSelectable <= 0}
                                    sx={{ mx: -1 }}
                                    disableTouchRipple
                                />
                                <Typography color='inherit'>{props.numSelected} selected</Typography>
                            </Button>
                            {props.actions?.onDelete && (
                                <>
                                    <Divider orientation="vertical" flexItem />
                                    <Tooltip title='Delete'>
                                        <IconButton onClick={() => props.actions?.onDelete()}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )}                            
                        </Stack>
                    </Paper>
                </Fade>
            )}
        </Popper>
    )
}
