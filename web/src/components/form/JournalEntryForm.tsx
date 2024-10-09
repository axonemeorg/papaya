'use client';

import { Box, Button, Grid2 as Grid, Icon, IconButton, InputAdornment, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Add, Delete } from "@mui/icons-material";
import { Controller, FieldArrayWithId, useFieldArray, UseFieldArrayReturn, useFormContext } from "react-hook-form";
import { CreateJournalEntry } from "@/types/post";
import { TransactionType } from "@/types/enum";
import CategoryAutocomplete from "../input/CategoryAutocomplete";
import { debounce } from "@/utils/Utils";
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from "dayjs";
import { Category, TransactionMethod } from "@/types/get";
import { findMostSimilarUserCategory } from "@/actions/category-actions";

interface JournalEntryTransactionRowProps {
    index: number;
    fieldArray: UseFieldArrayReturn<CreateJournalEntry>;
}

const JournalEntryTransactionRow = (props: JournalEntryTransactionRowProps) => {
    const { setValue, control, watch } = useFormContext<CreateJournalEntry>();

    return (
        
        <Grid container columns={12} spacing={1} sx={{ alignItems: 'center' }}>
            <Grid size={'grow'}>
                <Controller
                    control={control}
                    name={`transactions.${props.index}.amount` as const}
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
                        />
                    )}
                />
            </Grid>
            <Grid size={4}>
                <TextField
                    label='Memo (Optional)'
                    fullWidth
                />
            </Grid>
            <Grid size={4}>
                <Controller
                    control={control}
                    name={`transactions.${props.index}.category` as const}
                    render={({ field }) => (
                        <CategoryAutocomplete
                            {...field}
                            ref={null}
                            value={watch(`transactions.${props.index}.category`) as Category ?? null}
                            onChange={(_event, newValue) => {
                                setValue(field.name, newValue);
                            }}
                            label='Category (Optional)'
                        />
                    )}
                />
            </Grid>
            <Grid size='auto'>              
                <IconButton
                    onClick={() => props.fieldArray.remove(props.index)}
                    disabled={props.fieldArray.fields.length <= 1}
                >
                    <Delete />
                </IconButton>
            </Grid>
        </Grid>
        
    )
}

export default function JournalEntryForm() {
    const [manuallySetCategory, setManuallySetCategory] = useState<boolean>(false);
    const enableAutoDetectCategory = false;

    const { watch, control, getValues, setValue } = useFormContext<CreateJournalEntry>();

    const transactionsFieldArray = useFieldArray<CreateJournalEntry>({
        name: 'transactions',
        control
    });

    const addDebitTransaction = () => {
        transactionsFieldArray.append({
            amount: '',
            memo: '',
            paymentType: undefined,
            transactionMethod: undefined,
            transactionType: TransactionType.Enum.DEBIT
        });
    }

    const addCreditTransaction = () => {
        transactionsFieldArray.append({
            amount: '',
            memo: '',
            paymentType: undefined,
            transactionMethod: undefined,
            transactionType: TransactionType.Enum.CREDIT
        });
    }

    const transactions = getValues('transactions');
    const transactionFields = transactionsFieldArray.fields.map((field, index: number): [FieldArrayWithId<CreateJournalEntry>, number] => {
        return [field, index]
    });

    const debitTransactionFields = transactionFields.filter(([_field, index])  => {
        return transactions[index].transactionType === TransactionType.Enum.DEBIT
    });

    const creditTransactionFields = transactionFields.filter(([_field, index])  => {
        return transactions[index].transactionType === TransactionType.Enum.CREDIT
    });

    const handleDetectCategoryWithAi = debounce(async (memo) => {
        if (memo.length < 2) {
            return
        }

        const category = await findMostSimilarUserCategory(memo);
        setValue('category', category);
    }, 500)

    return (
        <>
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
                        multiline
                        maxRows={3}
                        sx={{ mb: 2 }}
                    />
                )}
            />
            <Grid container columns={12} spacing={1} rowSpacing={2} mb={1}>
                <Grid size={{ xs: 6, md: 4  }}>
                    <Controller
                        control={control}
                        name='date'
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
                <Grid size={{ xs: 6, md: 4}}>
                    <Controller
                        control={control}
                        name='time'
                        render={({ field }) => {
                            const value = dayjs([
                                dayjs(watch('date')).format('YYYY-MM-DD'),
                                field.value
                            ].join(' '));

                            return (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        {...field}
                                        value={value}
                                        onChange={(value) => {
                                            setValue(field.name, value?.format('HH:mm:ss') ?? '');
                                        }}
                                        label='Time'
                                        slotProps={{
                                            textField:  {
                                                fullWidth: true
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            );
                        }}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4}}>
                    <Controller
                        control={control}
                        name='category'
                        render={({ field }) => (
                            <CategoryAutocomplete
                                {...field}
                                ref={null}
                                value={watch('category') as Category ?? null}
                                onChange={(_event, newValue) => {
                                    setManuallySetCategory(Boolean(newValue))
                                    setValue(field.name, newValue);
                                }}
                            />
                        )}
                    />
                </Grid>
            </Grid>
            <Box mb={1}>
                <Typography variant='overline'><strong>Money Out</strong></Typography>
            </Box>
            <Stack mb={2} spacing={2}>
                {debitTransactionFields.map(([field, index]) => {
                    return (
                        <JournalEntryTransactionRow
                            key={field.id}
                            index={index}
                            fieldArray={transactionsFieldArray}
                        />
                    )
                })}
            </Stack>
            
            <Button startIcon={<Add />} onClick={() => addDebitTransaction()}>Add Transaction</Button>
        
            <Box mb={1}>
                <Typography variant='overline'><strong>Money In</strong></Typography>
            </Box>
            <Stack mb={2} spacing={2}>
                {creditTransactionFields.map(([field, index]) => {
                    return (
                        <JournalEntryTransactionRow
                            key={field.id}
                            index={index}
                            fieldArray={transactionsFieldArray}
                        />
                    )
                })}
            </Stack>
            <Button startIcon={<Add />} onClick={() => addCreditTransaction()}>Add Transaction</Button>
        </>
    )
}
