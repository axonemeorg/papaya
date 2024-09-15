'use client';

import { Add, Save } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent,  DialogContentText,  DialogTitle} from "@mui/material";
import JournalEntryForm from "../form/JournalEntryForm";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentType, TransactionType } from "@/types/enum";
import { useEffect, useState } from "react";
import { updateJournalEntry } from "@/actions/journal-actions";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";
import { JournalEntry } from "@/types/get";

interface EditJournalEntryModalProps {
    open: boolean;
    initialValues: JournalEntry;
    onClose: () => void;
}

export default function EditJournalEntryModal(props: EditJournalEntryModalProps) {
    const [saving, setSaving] = useState<boolean>(false);

    const handleUpdateJournalEntry = (formData: JournalEntry) => {
        setSaving(true);
        updateJournalEntry(formData)
            .then(() => {
                props.onClose();
            })
            .catch(() => {

            })
            .finally(() => {
                setSaving(false);
            })
    }

    const editJournalEntryForm = useForm<JournalEntry>({
        defaultValues: {
            ...props.initialValues
        },
        resolver: zodResolver(JournalEntry)
    });

    useEffect(() => {
        if (props.open) {
            editJournalEntryForm.reset();
        }
    }, [props.open])

    const { formState: { errors} } = editJournalEntryForm

    return (
        <FormProvider {...editJournalEntryForm}>
            <Dialog open={props.open} fullWidth onClose={props.onClose} maxWidth='md'>
                <form onSubmit={editJournalEntryForm.handleSubmit(handleUpdateJournalEntry)}>
                    <DialogTitle>Edit Entry</DialogTitle>
                    <DialogContent sx={{ overflow: "initial" }}>
                        <JournalEntryForm />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => props.onClose()}>Cancel</Button>
                        <LoadingButton loading={saving} type='submit' variant='contained' startIcon={<Save />}>Save</LoadingButton>
                    </DialogActions>
                </form>
            </Dialog>
        </FormProvider>
    )
}
