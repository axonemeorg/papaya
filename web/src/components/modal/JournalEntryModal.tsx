'use client';

import { Add } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent,  DialogTitle} from "@mui/material";
import JournalEntryForm from "../form/JournalEntryForm";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateJournalEntry } from '@/types/journal'


export default function JournalEntryModal() {

    const formMethods = useForm<CreateJournalEntry>({
        defaultValues: {
            memo: '',
            transactions: [
                {
                    type: "DEBIT",
                    date: new Date().toISOString(),
                    memo: '',
                    amount: undefined,
                    paymentType: undefined,
                    transactionMethodId: undefined,
                }
            ]
        },
        resolver: zodResolver(CreateJournalEntry)
    });

    // const { trigger, getValues } = formMethods;

    return (
        <FormProvider {...formMethods}>
            <Dialog open={true} fullWidth>
                <DialogTitle>Add Entry</DialogTitle>
                <DialogContent>
                    <JournalEntryForm />
                </DialogContent>
                <DialogActions>
                    <Button>Cancel</Button>
                    <Button variant='contained' startIcon={<Add />}>Add</Button>
                </DialogActions>
            </Dialog>
        </FormProvider>
    )
}
