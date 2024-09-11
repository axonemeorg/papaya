'use client';

import { CreateQuickJournalEntry } from "@/types/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import QuickJournalEntryForm from "../form/QuickJournalEntryForm";
import { Box, Button, Stack } from "@mui/material";
import { Add, Save } from "@mui/icons-material";
import { useState } from "react";
import { createQuickJournalEntry } from "@/actions/journal-actions";

export default function QuickJournalEditor() {
    const [isActive, setIsActive] = useState<boolean>(false);

    const createQuickJournalEntryForm = useForm<CreateQuickJournalEntry>({
        defaultValues: {
            memo: '',
            category: undefined,
            amount: undefined,
        },
        resolver: zodResolver(CreateQuickJournalEntry)
    });

    const handleCreateQuickJournalEntry = async (formData: CreateQuickJournalEntry) => {
        try {
            await createQuickJournalEntry(formData)
            setIsActive(false);
            createQuickJournalEntryForm.reset();
        } catch {
            //
        } finally {
            //
        }
    }

    return (
        <FormProvider {...createQuickJournalEntryForm}>
            <form onSubmit={createQuickJournalEntryForm.handleSubmit(handleCreateQuickJournalEntry)}>
                <Box px={2} py={1}>
                    {isActive ? (
                        <Stack direction='row'>
                            <QuickJournalEntryForm />
                            <Button type='submit' startIcon={<Save />}>Save</Button>
                            <Button onClick={() => setIsActive(false)}>Cancel</Button>
                        </Stack>
                    ) : (
                        <Button startIcon={<Add />} onClick={() => setIsActive(true)}>New Entry</Button>
                    )}
                </Box>
            </form>
        </FormProvider>
    )
}