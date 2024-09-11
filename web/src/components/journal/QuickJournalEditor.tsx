'use client';

import { CreateQuickJournalEntry } from "@/types/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import QuickJournalEntryForm from "../form/QuickJournalEntryForm";
import { Box, Button, Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";

interface QuickJournalEditorProps {
    date: string;
}

export default function QuickJournalEditor(props: QuickJournalEditorProps) {
    const [isActive, setIsActive] = useState<boolean>(false);

    const createQuickJournalEntryForm = useForm<CreateQuickJournalEntry>({
        defaultValues: {
            memo: '',
            category: undefined,
            amount: undefined,
            date: props.date,
        },
        resolver: zodResolver(CreateQuickJournalEntry)
    });

    return (
        <FormProvider {...createQuickJournalEntryForm}>
            <Box px={2} py={1}>
                {isActive ? (
                    <Stack direction='row'>
                        <QuickJournalEntryForm />
                        <Button onClick={() => setIsActive(false)}>Cancel</Button>
                    </Stack>
                ) : (
                    <Button startIcon={<Add />} onClick={() => setIsActive(true)}>New Entry</Button>
                )}
            </Box>
        </FormProvider>
    )
}