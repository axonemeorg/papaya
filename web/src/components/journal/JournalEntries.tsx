'use client'

import { useState } from "react";
import JournalEntryModal from "../modal/JournalEntryModal";
import { Fab, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { JournalEntryContext } from "@/contexts/JournalEntryContext";
import { TransactionMethodContext } from "@/contexts/TransactionMethodContext";

type JournalEntriesProps = JournalEntryContext & TransactionMethodContext;

export default function JournalEntries(props: JournalEntriesProps) {
    const { journalEntries, transactionMethods } = props;
    const [showJournalEntryModal, setShowJournalEntryModal] = useState<boolean>(false);

    return (
        <TransactionMethodContext.Provider value={{ transactionMethods }}>
            <JournalEntryContext.Provider value={{ journalEntries }}>
                <Typography>Hello world</Typography>
                <JournalEntryModal
                    open={showJournalEntryModal}
                    onClose={() => setShowJournalEntryModal(false)}
                />
                <Fab color='primary' aria-label='add' onClick={() => setShowJournalEntryModal(true)}>
                    <Add />
                </Fab>
            </JournalEntryContext.Provider>
        </TransactionMethodContext.Provider>
    )
}
