import { ArrowDropDown } from "@mui/icons-material";
import { Button, ButtonGroup, Menu, MenuItem, Stack } from "@mui/material";
import { useRef, useState } from "react";

interface JournalActionsProps {
    onPromptDeleteJournal: () => void;
    onPromptResetJournal: () => void;
}

export default function JournalActions(props: JournalActionsProps) {
    const anchorRef = useRef<HTMLDivElement>(null);
    const [showResetMenu, setShowResetMenu] = useState(false);

    const handlePromptDeleteJournal = () => {
        props.onPromptDeleteJournal();
        setShowResetMenu(false);
    }

    const handlePromptResetJournal = () => {
        props.onPromptResetJournal();
        setShowResetMenu(false);
    }

    return (
        <>
            <Menu anchorEl={anchorRef.current} open={showResetMenu} onClose={() => setShowResetMenu(false)}>
                <MenuItem onClick={() => props.onPromptResetJournal()}>Reset</MenuItem>
            </Menu>
            <Stack direction='column' gap={1} color='error'>
                <ButtonGroup variant='outlined' ref={anchorRef}>
                    <Button onClick={() => handlePromptDeleteJournal()}>
                        Delete
                    </Button>
                    <Button
                        size="small"
                        aria-controls={showResetMenu ? 'split-button-menu' : undefined}
                        aria-expanded={showResetMenu ? 'true' : undefined}
                        aria-label="select journal reset action"
                        aria-haspopup="menu"
                        onClick={() => handlePromptResetJournal()}
                    >
                        <ArrowDropDown />
                    </Button>
                </ButtonGroup>
            </Stack>
        </>
    )
}