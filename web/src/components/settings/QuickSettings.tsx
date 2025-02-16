import { Popover, Typography } from "@mui/material";

interface QuickSettingsProps {
    open: boolean
    anchorEl: HTMLElement | null
}

export default function QuickSettings(props: QuickSettingsProps) {
    return (
        <Popover
            open={props.open}
            anchorEl={props.anchorEl}
        >
            <Typography>Settings</Typography>


        </Popover>
    )
}