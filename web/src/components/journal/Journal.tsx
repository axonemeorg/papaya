'use client'

import JournalEntries from "@/components/journal/JournalEntries";
import BaseLayout from "../layout/BaseLayout";
import JournalHeader from "./JournalHeader";
import { JournalDate } from "@/types/calendar";
import { JournalEntryContext } from "@/contexts/JournalEntryContext";
import { TransactionMethodContext } from "@/contexts/TransactionMethodContext";
import { CategoryContext } from "@/contexts/CategoryContext";
import { useState } from "react";
import { Divider, Drawer, IconButton, Stack, Typography } from "@mui/material";
import { CreditCard } from "@mui/icons-material";
import ManageTransactionMethods from "./ManageTransactionMethods";

type JournalProps = 
    & JournalDate
    & JournalEntryContext
    & TransactionMethodContext
    & CategoryContext;

export default function Journal(props: JournalProps) {
    const {
        categories,
        journalEntries,
        transactionMethods,
        month,
        year
    } = props;
    
    const [methodsDrawerOpen, setMethodsDrawerOpen] = useState<boolean>(false);

    return (
        <BaseLayout
            headerChildren={
                <JournalHeader month={month} year={year}>
                    <IconButton onClick={() => setMethodsDrawerOpen(true)}>
                        <CreditCard />
                    </IconButton>
                </JournalHeader>
            }
        >
            <CategoryContext.Provider value={{ categories }}>
                    <TransactionMethodContext.Provider value={{ transactionMethods }}>
                        <JournalEntryContext.Provider value={{ journalEntries }}>
                            <>
                                <JournalEntries />
                                <Drawer anchor='right' open={methodsDrawerOpen} onClose={() => setMethodsDrawerOpen(false)}>
                                    <Stack sx={(theme) => ({ height: theme.spacing(11) })} alignItems='center'>
                                        <Typography variant='h6'>Transaction Methods</Typography>
                                    </Stack>
                                    <Divider />
                                    <ManageTransactionMethods />
                                </Drawer>
                            </>
                    </JournalEntryContext.Provider>
                </TransactionMethodContext.Provider>
            </CategoryContext.Provider>
                
        </BaseLayout>
    )
}
