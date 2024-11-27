'use client';

import { Add } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent,  DialogContentText,  DialogTitle, useMediaQuery, useTheme} from "@mui/material";
import JournalEntryForm from "../form/JournalEntryForm";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";
import { NotificationsContext } from "@/contexts/NotificationsContext";
import { CreateJournalEntryForm, JournalEntry } from "@/types/schema";
import { db } from "@/database/client";
import { createOrUpdateJournalEntry } from "@/database/actions";

interface JournalEntryModalProps {
    open: boolean;
    initialDate: string;
    onClose: () => void;
    onSaved: () => void;
}

export default function CreateJournalEntryModal(props: JournalEntryModalProps) {
    const { snackbar } = useContext(NotificationsContext);

    const handleCreateJournalEntry = async (formData: CreateJournalEntryForm) => {
        await createOrUpdateJournalEntry(formData);
        snackbar({ message: 'Created journal entry'});
        props.onSaved();
    }

    const createJournalEntryForm = useForm<CreateJournalEntryForm>({
        defaultValues: {
            parent: {
                memo: '',
                amount: '',
                date: props.initialDate,
                categoryIds: [],
                tagIds: [],
                artifactIds: [],
                notes: '',
                entryType: 'CREDIT',
                paymentMethodId: null,
                relatedEntryIds: [],
            },
            children: [],
        },
        resolver: zodResolver(CreateJournalEntryForm)
    });

    useEffect(() => {
        createJournalEntryForm.setValue('parent.date', props.initialDate);
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
                        <Button type='submit' variant='contained' startIcon={<Add />}>Add</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </FormProvider>
    )
}
