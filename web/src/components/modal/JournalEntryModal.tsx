'use client';

import { Add } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent,  DialogTitle} from "@mui/material";
import JournalEntryForm from "../form/JournalEntryForm";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateJournalEntry } from '@/types/post'

interface JournalEntryModalProps {
    open: boolean;
    onClose: () => void;
}

export default function JournalEntryModal(props: JournalEntryModalProps) {

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
            <Dialog open={props.open} fullWidth onClose={props.onClose} maxWidth='md'>
                <DialogTitle>Add Entry</DialogTitle>
                <DialogContent>
                    <JournalEntryForm />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.onClose()}>Cancel</Button>
                    <Button variant='contained' startIcon={<Add />}>Add</Button>
                </DialogActions>
            </Dialog>
        </FormProvider>
    )
}
