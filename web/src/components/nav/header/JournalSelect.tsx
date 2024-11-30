'use client';

import { Insights, ReceiptLong, UnfoldMore } from "@mui/icons-material";
import { Button, ListItemIcon, ListItemText, MenuItem as MuiMenuItem, MenuItemProps, Select, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo, useState } from "react";

const items: any[] = [
    {
        key: '1',
        journalName: 'My Journal',
        lastSynced: '5 minutes ago'
    },
];

export default function JournalSelect() {

    return (
        <>
            <Button endIcon={<UnfoldMore />}>
                <Typography variant='h6'>My Journal</Typography>
            </Button>
        </>
    )
}
