'use client';

import { PLACEHOLDER_UNNAMED_JOURNAL_NAME } from "@/constants/journal";
import { JournalContext } from "@/contexts/JournalContext";
import { Insights, ReceiptLong, UnfoldMore } from "@mui/icons-material";
import { Button, ListItemIcon, ListItemText, MenuItem as MuiMenuItem, MenuItemProps, Select, Typography, Tooltip } from "@mui/material";
import { useContext } from "react";

export default function ActiveJournal() {
    const journalContext = useContext(JournalContext);
    const { journal, openJournalManager } = journalContext;

    let journalName = journal?.journalName;
    if (journalName === '') {
        journalName = PLACEHOLDER_UNNAMED_JOURNAL_NAME;
    }

    return (
        <Tooltip title='Manage Journals'>
            <Button endIcon={<UnfoldMore />} onClick={() => openJournalManager()}>
                <Typography variant='h6'>{journalName}</Typography>
            </Button>
        </Tooltip>
    )
}
