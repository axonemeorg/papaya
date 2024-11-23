'use client';

import { Box, Button, Chip, Collapse, Grid2 as Grid, Icon, IconButton, InputAdornment, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import CategoryAutocomplete from "../input/CategoryAutocomplete";
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from "dayjs";
import { Category, CreateJournalEntryForm, JournalEntry } from "@/types/schema";

// const JournalEntryTransactionRow = (props: JournalEntryTransactionRowProps) => {
//     const { setValue, control, watch, register } = useFormContext<CreateJournalEntry>();

//     const transactionTags = watch(`transactions.${props.index}.tags`) ?? [];
//     const hasTags = transactionTags.length > 0;

//     return (
//         <Grid container columns={12} spacing={1} rowSpacing={0} sx={{ alignItems: 'center' }}>
//             <Grid size={'grow'}>
//                 <Controller
//                     control={control}
//                     name={`transactions.${props.index}.amount` as const}
//                     render={({ field }) => (
//                         <TextField
//                             label='Amount'
//                             {...field}
//                             onChange={(event) => {
//                                 const value = event.target.value;
//                                 const newValue = value.replace(/[^0-9.]/g, '') // Remove non-numeric characters except the dot
//                                     .replace(/(\..*?)\..*/g, '$1') // Allow only one dot
//                                     .replace(/(\.\d{2})\d+/g, '$1'); // Limit to two decimal places
//                                 field.onChange(newValue);
//                             }}
//                             fullWidth
//                             InputProps={{
//                                 startAdornment: <InputAdornment position="start">$</InputAdornment>,
//                             }}
//                             sx={{ flex: 1 }}
//                             size="small"
//                         />
//                     )}
//                 />
//             </Grid>
//             <Grid size={4}>
//                 <Controller
//                     control={control}
//                     name={`transactions.${props.index}.category` as const}
//                     render={({ field }) => (
//                         <CategoryAutocomplete
//                             {...field}
//                             ref={null}
//                             value={watch(`transactions.${props.index}.category`) as Category ?? null}
//                             onChange={(_event, newValue) => {
//                                 setValue(field.name, newValue);
//                             }}
//                             label='Category (Optional)'
//                             size='small'
//                         />
//                     )}
//                 />
//             </Grid>
//             <Grid size={4}>
//                 <TextField
//                     label='Memo (Optional)'
//                     {...register(`transactions.${props.index}.memo`)}
//                     fullWidth
//                     size='small'
//                 />
//             </Grid>
//             <Grid size='auto'>
//                 <Stack direction='row'>           
//                     <IconButton onClick={props.onClickTagButton}>
//                         <Label />
//                     </IconButton>
//                     <IconButton
//                         onClick={() => props.remove(props.index)}
//                         disabled={props.fieldArray.length <= 1}
//                     >
//                         <Delete />
//                     </IconButton>
//                 </Stack>
//             </Grid>
//             <Grid size={12}>
//                 <Collapse in={hasTags}>
//                     <Stack gap={1} sx={{ pt: 1.25, pb: 0.75, flexFlow: 'row wrap' }}>
//                         {transactionTags.map((tagRecord) => {
//                             return (
//                                 <Chip
//                                     size='small'
//                                     key={tagRecord.tag}
//                                     label={TRANSACTION_TAG_LABELS[tagRecord.tag]?.label}
//                                 />
//                             );
//                         })}
//                     </Stack>
//                 </Collapse>
//             </Grid>
//         </Grid>
//     )
// }

export default function JournalEntryForm() {
    const { setValue, control, watch } = useFormContext<CreateJournalEntryForm>();

    return (
        <Grid container columns={12} spacing={1} rowSpacing={1} mb={1}>
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
                        const categoryId: Category['_id'] | null = !categoryIds?.length ? null : categoryIds[0];

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
