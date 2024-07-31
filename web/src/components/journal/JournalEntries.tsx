'use client'

import { useState } from "react";
import JournalEntryModal from "../modal/JournalEntryModal";
import { Fab, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { JournalEntryContext } from "@/contexts/JournalEntryContext";
import { TransactionMethodContext } from "@/contexts/TransactionMethodContext";
import { CategoryContext } from "@/contexts/CategoryContext";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

type JournalEntriesProps =
    & JournalEntryContext
    & TransactionMethodContext
    & CategoryContext;

export default function JournalEntries(props: JournalEntriesProps) {
    const { journalEntries, transactionMethods, categories } = props;
    const [showJournalEntryModal, setShowJournalEntryModal] = useState<boolean>(false);

    const rows = journalEntries.map((entry) => {
        return {
            id: entry.categoryId,
            memo: entry.memo,
            date: entry.transactions[0].createdAt,
            category: entry

        }
    })

    // const columns: GridColDef<Type>[] = [
    //     {

    //     }
    // ]

    return (
        <CategoryContext.Provider value={{ categories }}>
            <TransactionMethodContext.Provider value={{ transactionMethods }}>
                <JournalEntryContext.Provider value={{ journalEntries }}>
                    
                    <DataGrid
                        rows={}
                    />

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
