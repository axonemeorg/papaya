'use client';

import { Box, Button, Chip, Collapse, Grid2 as Grid, Icon, IconButton, InputAdornment, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import CategoryAutocomplete from "../input/CategoryAutocomplete";
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from "dayjs";
import { Category, CreateJournalEntryForm, JournalEntry } from "@/types/schema";

export default function JournalEntryForm() {
    const { setValue, control, watch } = useFormContext<CreateJournalEntryForm>();
 
    return (
        <Grid container columns={12} spacing={1} rowSpacing={2} mb={1}>
            <Grid size={8}>
                <Controller
                    control={control}
                    name='parent.memo'
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
                                // if (!manuallySetCategory && enableAutoDetectCategory) {
                                //     handleDetectCategoryWithAi(value);
                                // }
                            }}
                            fullWidth
                            multiline
                            maxRows={3}
                            sx={{ mb: 2 }}
                        />
                    )}
                />
            </Grid>
            <Grid size={4}>
                <Controller
                    control={control}
                    name='parent.amount'
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
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            sx={{ flex: 1 }}
                            autoComplete="off"
                        />
                    )}
                />
            </Grid>
            <Grid size={6}>
                <Controller
                    control={control}
                    name='parent.date'
                    render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                {...field}
                                value={dayjs(field.value)}
                                onChange={(value) => {
                                    setValue(field.name, value?.format('YYYY-MM-DD') ?? '');
                                }}
                                format='ddd, MMM D'
                                label='Date'
                                slotProps={{
                                    textField:  {
                                        fullWidth: true
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    )}
                />
            </Grid>
            <Grid size={6}>
                <Controller
                    control={control}
                    name='parent.categoryIds'
                    render={({ field }) => {
                        const categoryIds = watch('parent.categoryIds');
                        const categoryId: Category['_id'] | null = categoryIds?.length > 0 ? categoryIds[0] : null;

                        return (
                            <CategoryAutocomplete
                                {...field}
                                ref={null}
                                value={categoryId}
                                onChange={(_event, newValue) => {
                                    // setManuallySetCategory(Boolean(newValue))
                                    setValue(field.name, newValue ? [newValue] : []);
                                }}
                            />
                        );
                    }}
                />
            </Grid>
        </Grid>
    )
}
