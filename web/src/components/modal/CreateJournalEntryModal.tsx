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
import { CreateJournalEntry, JournalEntry } from "@/types/schema";
import { db } from "@/database/client";

interface JournalEntryModalProps {
    open: boolean;
    initialDate: string;
    onClose: () => void;
}

export default function CreateJournalEntryModal(props: JournalEntryModalProps) {
    const { snackbar } = useContext(NotificationsContext);

    const handleCreateJournalEntry = (formData: CreateJournalEntry) => {
        const { parent } = formData;
        const children = formData.children.map(child => {
            return {
                ...child,
                date: parent.date,
                parent: parent._id,
            }
        });
        db.bulkDocs([parent, ...children]);
        snackbar({ message: 'Created journal entry'});
    }

    const createJournalEntryForm = useForm<CreateJournalEntry>({
        defaultValues: {
            parent: {
                _id: '',
                _type: 'JOURNAL_ENTRY',
                memo: '',
                date: props.initialDate,
                categoryIds: [],
                tagIds: [],
                attachmentIds: [],
                notes: '',
                entryType: 'CREDIT',
            },
            children: [],
        },
        resolver: zodResolver(CreateJournalEntry)
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
