'use client'

import { useState } from "react";
import JournalEntryModal from "../modal/JournalEntryModal";
import { Fab, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { JournalEntryContext } from "@/contexts/JournalEntryContext";
import { TransactionMethodContext } from "@/contexts/TransactionMethodContext";
import { CategoryContext } from "@/contexts/CategoryContext";

type JournalEntriesProps =
    & JournalEntryContext
    & TransactionMethodContext
    & CategoryContext;

export default function JournalEntries(props: JournalEntriesProps) {
    const { journalEntries, transactionMethods, categories } = props;
    const [showJournalEntryModal, setShowJournalEntryModal] = useState<boolean>(false);

    return (
        <CategoryContext.Provider value={{ categories }}>
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
        </CategoryContext.Provider>
    )
}
