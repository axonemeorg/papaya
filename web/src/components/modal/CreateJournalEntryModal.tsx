'use client';

import { Add } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent,  DialogContentText,  DialogTitle, useMediaQuery, useTheme} from "@mui/material";
import JournalEntryForm from "../form/JournalEntryForm";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateJournalEntry } from '@/types/post'
import { PaymentType, TransactionType } from "@/types/enum";
import { useContext, useEffect, useState } from "react";
import { createJournalEntry } from "@/actions/journal-actions";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";
import { NotificationsContext } from "@/contexts/NotificationsContext";

interface JournalEntryModalProps {
    open: boolean;
    initialDate: string;
    onClose: () => void;
}

export default function CreateJournalEntryModal(props: JournalEntryModalProps) {
    const [saving, setSaving] = useState<boolean>(false);
    const { snackbar } = useContext(NotificationsContext);

    const journalEntryDefaultValues: CreateJournalEntry = {
        memo: '',
        date: props.initialDate,
        category: undefined,
        time: dayjs().format("HH:mm:ss"),
        transactions: [
            {
                transactionType: TransactionType.Enum.DEBIT,
                // date: new Date().toISOString(),
                memo: '',
                amount: undefined as unknown as string,
                // paymentType: PaymentType.Enum.ETRANSFER, // TODO
                paymentType: undefined,
                transactionMethod: undefined,
                tags: [],
            }
        ],
        attachments: [],
    }

    const createJournalEntryForm = useForm<CreateJournalEntry>({
        defaultValues: journalEntryDefaultValues,
        resolver: zodResolver(CreateJournalEntry)
    });

    const handleCreateJournalEntry = (formData: CreateJournalEntry) => {
        setSaving(true);
        createJournalEntry(formData)
            .then(() => {
                props.onClose();
                snackbar({ message: 'Created journal entry'});
                createJournalEntryForm.reset({
                    // Resets the form but preserves the last entered date
                    ...journalEntryDefaultValues,
                    date: formData.date
                })
            })
            .catch(() => {

            })
            .finally(() => {
                setSaving(false);
            });
    }

    useEffect(() => {
        createJournalEntryForm.setValue('date', props.initialDate);
    }, [props.initialDate]);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <FormProvider {...createJournalEntryForm}>
            <Dialog open={props.open} fullWidth fullScreen={fullScreen} onClose={props.onClose} maxWidth='md'>
                <form onSubmit={createJournalEntryForm.handleSubmit(handleCreateJournalEntry)}>
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
