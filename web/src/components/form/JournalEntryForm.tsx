'use client';

import { Box, Button, Chip, Collapse, Grid2 as Grid, Icon, IconButton, InputAdornment, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { Controller, useFieldArray, UseFieldArrayReturn, useFormContext } from "react-hook-form";
import CategoryAutocomplete from "../input/CategoryAutocomplete";
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from "dayjs";
import { Category, CreateJournalEntryForm, EntryTag, JournalEntry } from "@/types/schema";
import { Delete, Label } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { getEntryTags } from "@/database/queries";

interface JournalEntryChildRowProps {
    index: number;
    fieldArray: UseFieldArrayReturn<CreateJournalEntryForm>['fields'];
    entryTags: Record<string, EntryTag>;
    remove: UseFieldArrayReturn<CreateJournalEntryForm>['remove'];
    onClickTagButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const JournalEntryChildRow = (props: JournalEntryChildRowProps) => {
    const { setValue, control, watch, register } = useFormContext<CreateJournalEntryForm>();

    const childTagIds = watch(`children.${props.index}.tagIds`) ?? [];
    const hasTags = childTagIds.length > 0;
    const categoryIds = watch(`children.${props.index}.categoryIds`) as string[] | undefined ?? [];
    const categoryId: string | undefined = categoryIds.length > 0 ? categoryIds[0] : undefined;

    return (
        <Grid container columns={12} spacing={1} rowSpacing={0} sx={{ alignItems: 'center' }}>
            <Grid size={'grow'}>
                <Controller
                    control={control}
                    name={`children.${props.index}.amount` as const}
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
                            size="small"
                        />
                    )}
                />
            </Grid>
            <Grid size={4}>
                <Controller
                    control={control}
                    name={`children.${props.index}.categoryIds` as const}
                    render={({ field }) => (
                        <CategoryAutocomplete
                            {...field}
                            ref={null}
                            value={categoryId}
                            onChange={(_event, newValue) => {
                                setValue(field.name, newValue ? [newValue] : []);
                            }}
                            label='Category'
                            size='small'
                        />
                    )}
                />
            </Grid>
            <Grid size={4}>
                <TextField
                    label='Memo'
                    {...register(`children.${props.index}.memo`)}
                    fullWidth
                    size='small'
                />
            </Grid>
            <Grid size='auto'>
                <Stack direction='row'>           
                    <IconButton onClick={props.onClickTagButton}>
                        <Label />
                    </IconButton>
                    <IconButton
                        onClick={() => props.remove(props.index)}
                        disabled={props.fieldArray.length <= 1}
                    >
                        <Delete />
                    </IconButton>
                </Stack>
            </Grid>
            <Grid size={12}>
                <Collapse in={hasTags}>
                    <Stack gap={1} sx={{ pt: 1.25, pb: 0.75, flexFlow: 'row wrap' }}>
                        {childTagIds.map((entryTagId) => {
                            const entryTag = props.entryTags[entryTagId];
                            return (
                                <Chip
                                    size='small'
                                    key={entryTag._id}
                                    label={entryTag.label}
                                />
                            );
                        })}
                    </Stack>
                </Collapse>
            </Grid>
        </Grid>
    )
}

export default function JournalEntryForm() {
    const { setValue, control, watch } = useFormContext<CreateJournalEntryForm>();

    const {
        fields: childrenFieldArray,
        append: appendChild,
        remove: removeChild,
    } = useFieldArray<CreateJournalEntryForm>({
        control,
        name: 'children',
    });

    const entryTagQuery = useQuery<Record<EntryTag['_id'], EntryTag>>({
        queryKey: ['entryTags'],
        queryFn: getEntryTags,
        initialData: {},
    });

    const handleAddChild = () => {
        appendChild({
            amount: '',
            memo: '',
            entryType: 'CREDIT',
        });
    }

    return (
        <Box>
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
            <Stack>
                {childrenFieldArray.map((field, index) => {
                    return (
                        <JournalEntryChildRow
                            key={field.id}
                            index={index}
                            fieldArray={childrenFieldArray}
                            remove={removeChild}
                            onClickTagButton={(event) => {
                                // setTransactionTagPickerData({
                                //     anchorEl: event.currentTarget,
                                //     index,
                                // })
                            }}
                            entryTags={entryTagQuery.data}
                        />
                    )
                })}
                <Button
                    onClick={() => handleAddChild()}
                >
                    Add Child
                </Button>
            </Stack>
        </Box>
    )
}
