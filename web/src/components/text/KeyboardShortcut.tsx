import { alpha, Chip, Typography } from "@mui/material"
import { KEYBOARD_ACTIONS, KeyboardActionName } from "@/constants/keyboard"

interface KeyboardShortcutProps {
    name: KeyboardActionName
    chip?: boolean
}

export default function KeyboardShortcut(props: KeyboardShortcutProps) {
    const keystroke = KEYBOARD_ACTIONS[props.name]
    const keystrokeLabel = [
        keystroke.ctrlCmd ? 'Ctrl' : '',
        keystroke.altOpt ? 'Alt' : '',
        keystroke.shift ? 'Shift' : '',
        keystroke.symbol.toUpperCase(),
    ].filter(Boolean).join('+')

    if (props.chip) {
        return (
            <Chip
                variant="outlined"
                component={'span'}
                sx={(theme) => ({
                    fontSize: '0.8rem',
                    backgroundColor: alpha(theme.palette.background.paper, 0.6),
                    borderRadius: theme.spacing(1),
                    py: 0.125,
                    px: 0.75,
                    boxSizing: 'content-box',
                    minWidth: '1ch',
                    height: 'unset',
                    '& *': {
                        m: '0 !important',
                        p: '0 !important',
                    }
                })}
                label={keystrokeLabel}
            />
        )
    }

    return (
        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            {keystrokeLabel}
        </Typography>
    )
}
