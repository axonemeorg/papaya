'use client';

import { JournalContext } from "@/contexts/JournalContext";
import { Insights, ReceiptLong, UnfoldMore } from "@mui/icons-material";
import { Button, ListItemIcon, ListItemText, MenuItem as MuiMenuItem, MenuItemProps, Select, Typography, Tooltip } from "@mui/material";
import { useContext } from "react";

export default function ActiveJournal() {
    const journalContext = useContext(JournalContext);
    const { journal, openJournalManager } = journalContext;

    return (
        <Tooltip title='Manage Journals'>
            <Button endIcon={<UnfoldMore />} onClick={() => openJournalManager()}>
                <Typography variant='h6'>{journal?.journalName}</Typography>
            </Button>
        </Tooltip>
    )
}
