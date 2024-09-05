'use client';

import { Add } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent,  DialogContentText,  DialogTitle} from "@mui/material";
import JournalEntryForm from "../form/JournalEntryForm";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateJournalEntry } from '@/types/post'
import { PaymentType, TransactionType } from "@/types/enum";
import { useEffect, useState } from "react";
import { createJournalEntry } from "@/actions/journal-actions";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";

interface JournalEntryModalProps {
    open: boolean;
    initialDate: string;
    onClose: () => void;
}

export default function JournalEntryModal(props: JournalEntryModalProps) {
    const [saving, setSaving] = useState<boolean>(false);

    const handleCreateTransactionMethod = (formData: CreateJournalEntry) => {
        setSaving(true);
        createJournalEntry(formData)
            .then(() => {
                props.onClose();
            })
            .catch(() => {

            })
            .finally(() => {
                setSaving(false);
            })
    }

    const createJournalEntryForm = useForm<CreateJournalEntry>({
        defaultValues: {
            memo: '',
            date: props.initialDate,
            time: dayjs().format("HH:mm:ss"),
            transactions: [
                {
                    transactionType: TransactionType.Enum.DEBIT,
                    date: new Date().toISOString(),
                    memo: '',
                    amount: undefined,
                    // paymentType: PaymentType.Enum.ETRANSFER, // TODO
                    paymentType: undefined,
                    transactionMethod: undefined,
                }
            ]
        },
        resolver: zodResolver(CreateJournalEntry)
    });

    useEffect(() => {
        createJournalEntryForm.setValue('date', props.initialDate);
    }, [props.initialDate]);

    const { formState: { errors} } = createJournalEntryForm
    console.log('errors:', errors)

    console.log(createJournalEntryForm.getValues())

    return (
        <FormProvider {...createJournalEntryForm}>
            <Dialog open={props.open} fullWidth onClose={props.onClose} maxWidth='md'>
                <form onSubmit={createJournalEntryForm.handleSubmit(handleCreateTransactionMethod)}>
                    <DialogTitle>Add Entry</DialogTitle>
                    <DialogContent sx={{ overflow: "initial" }}>
                        <JournalEntryForm />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => props.onClose()}>Cancel</Button>
                        <LoadingButton loading={saving} type='submit' variant='contained' startIcon={<Add />}>Add</LoadingButton>
                    </DialogActions>
                </form>
            </Dialog>
        </FormProvider>
    )
}
