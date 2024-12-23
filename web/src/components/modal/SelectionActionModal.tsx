import { Button, ButtonBase, Checkbox, Divider, Popover, Stack, Typography } from "@mui/material"


interface SelectionActionModalProps {
    anchorEl: Element | null
    open: boolean
    numSelected: number
    numTotalSelectable: number
    onSelectAllChange: () => void
}

export default function SelectionActionModal(props: SelectionActionModalProps) {
    return (
        <Popover
            open={props.open}
            anchorEl={props.anchorEl}
        >
            <Stack direction='row' spacing={1}>
                <ButtonBase onClick={() => props.onSelectAllChange()}>
                    <Checkbox
                        indeterminate={props.numSelected < props.numTotalSelectable}
                        checked={props.numSelected === props.numTotalSelectable}
                    />
                    <Divider orientation="vertical" />
                    <Typography>{props.numSelected} selected</Typography>
                </ButtonBase>
            </Stack>
        </Popover>
    )
}
