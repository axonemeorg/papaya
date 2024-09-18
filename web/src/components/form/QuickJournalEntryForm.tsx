'use client';

import { Grid2 as Grid, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { CreateQuickJournalEntry } from "@/types/post";
import CategoryAutocomplete from "../input/CategoryAutocomplete";
import { findMostSimilarCategory } from "@/actions/category-actions";
import { debounce } from "@/utils/Utils";
import { Category } from "@/types/get";

export default function QuickJournalEntryForm() {
    const [manuallySetCategory, setManuallySetCategory] = useState<boolean>(false);
    const enableAutoDetectCategory = true;

    const { watch, control, setValue } = useFormContext<CreateQuickJournalEntry>();

    const handleDetectCategoryWithAi = debounce(async (memo) => {
        if (memo.length < 2) {
            return
        }

        const category = await findMostSimilarCategory(memo);
        setValue('category', category);
    }, 500)

    return (
        <Grid container columns={12} spacing={2}>
            <Grid size={3}>
                <Controller
                    control={control}
                    name='memo'
                    render={({ field }) => (
                        <TextField
                            label='Memo'
                            autoFocus
                            {...field}
                            ref={null}
                            value={field.value}
                            onChange={(event) => {
                                const value = event.target.value;
                                setValue(field.name, value);
                                if (!manuallySetCategory && enableAutoDetectCategory) {
                                    handleDetectCategoryWithAi(value);
                                }
                            }}
                            fullWidth
                            size='small'
                        />
                    )}
                />
            </Grid>
            <Grid size={3}>
                <Controller
                    control={control}
                    name={`amount`}
                    render={({ field }) => (
                        <TextField
                            label='Amount'
                            {...field}
                            onChange={(event) => {
                                const value = event.target.value;
                                const newValue = value.replace(/[^0-9.]/g, '') // Remove non-numeric characters except the dot
                                    .replace(/(\..*?)\..*/g, '$1') // Allow only one dot
                                    .replace(/(\.\d{2})\d+/g, '$1'); // Limit to two decimal places
                                field.onChange(newValue);
                            }}
                            fullWidth
                            size='small'
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                    )}
                />
            </Grid>
            <Grid size={5}>
                <Controller
                    control={control}
                    name='category'
                    render={({ field }) => (
                        <CategoryAutocomplete
                            {...field}
                            ref={null}
                            value={watch('category') as Category}
                            onChange={(_event, newValue) => {
                                setManuallySetCategory(Boolean(newValue))
                                setValue(field.name, newValue);
                            }}
                            size="small"
                        />
                    )}
                />
            </Grid>
        </Grid>
    )
}
