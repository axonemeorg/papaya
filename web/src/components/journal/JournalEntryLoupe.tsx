'use client'

import { Drawer } from "@mui/material"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

export const JOURNAL_ENTRY_LOUPE_SEARCH_PARAM_KEY = 'z';

export default function JournalEntryLoupe() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const journalEntryNumber = searchParams.get(JOURNAL_ENTRY_LOUPE_SEARCH_PARAM_KEY);

    const open = useMemo(() => {
        return Boolean(journalEntryNumber);
    }, [journalEntryNumber]);

    const handleClose = () => {
        router.push(pathname)
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    })

    return (
        <Drawer open={open} anchor='right' onClose={handleClose}>
            #{journalEntryNumber}
        </Drawer>
    )
}
