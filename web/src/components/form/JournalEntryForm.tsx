'use client';

import { Box, Button, Collapse, Grid, Icon, IconButton, InputAdornment, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Add, Delete } from "@mui/icons-material";
import CustomDatePicker from "../date/CustomDatePicker";
import TransactionMethodAutocomplete from "../input/TransactionMethodAutocomplete";
import { Controller, FieldArrayWithId, useFieldArray, UseFieldArrayReturn, useFormContext } from "react-hook-form";
import { CreateJournalEntry } from "@/types/post";
import { TransactionType } from "@/types/enum";
import CategoryAutocomplete from "../input/CategoryAutocomplete";
import { findMostSimilarCategory } from "@/actions/category-actions";
import { debounce } from "@/utils/Utils";
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from "dayjs";

interface JournalEntryTransactionRowProps {
    index: number;
    showAdvancedControls: boolean;
    fieldArray: UseFieldArrayReturn<CreateJournalEntry>;
}

const JournalEntryTransactionRow = (props: JournalEntryTransactionRowProps) => {
    const { setValue, control } = useFormContext<CreateJournalEntry>();

    return (
        <Stack direction='row' gap={1} alignItems='center'>
            <Grid container columns={12} spacing={1}>
                <Grid item xs={2}>
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
                <Grid item xs={4}>
                    <Controller
                        control={control}
                        name={`transactions.${props.index}.transactionMethod` as const}
                        render={({ field }) => (
                            <TransactionMethodAutocomplete
                                {...field}
                                ref={null}
                                value={field.value}
                                onChange={(_event, newValue) => {
                                    setValue(field.name, newValue);
                                    setValue(`transactions.${props.index}.paymentType`, newValue.defaultPaymentType)
                                }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label='Memo (Optional)'
                        fullWidth
                    />
                </Grid>
            </Grid>

            {props.showAdvancedControls && (
                <IconButton
                    onClick={() => props.fieldArray.remove(props.index)}
                    disabled={props.fieldArray.fields.length <= 1}
                >
                    <Delete />
                </IconButton>
            )}
        </Stack>
    )
}

export default function JournalEntryForm() {
    const [formTab, setFormTab] = useState(1);
    const [manuallySetCategory, setManuallySetCategory] = useState<boolean>(false);
    const enableAutoDetectCategory = false;

    const { watch, control, getValues, setValue } = useFormContext<CreateJournalEntry>();

    const transactionsFieldArray = useFieldArray<CreateJournalEntry>({
        name: 'transactions',
        control
    });

    const addDebitTransaction = () => {
        transactionsFieldArray.append({
            amount: undefined,
            date: new Date().toISOString(),
            memo: '',
            paymentType: undefined,
            transactionMethod: undefined,
            transactionType: TransactionType.Enum.DEBIT
        });
    }

    const addCreditTransaction = () => {
        transactionsFieldArray.append({
            amount: undefined,
            date: new Date().toISOString(),
            memo: '',
            paymentType: undefined,
            transactionMethod: undefined,
            transactionType: TransactionType.Enum.CREDIT
        });
    }

    const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
      setFormTab(newValue);
    };

    const showAdvancedControls = formTab === 1;

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

        const category = await findMostSimilarCategory(memo);
        setValue('category', category);
    }, 500)

    return (
        <>
            {/* <Box mb={2}>
                <Tabs value={formTab} onChange={handleChangeTab} centered>
                    <Tab label="Quick" />
                    <Tab label="Advanced" />
                </Tabs>
            </Box> */}
            <Grid container columns={12} spacing={1} mb={2}>
                <Grid item xs={4}>
                    <Controller
                        control={control}
                        name='date'
                        render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    {...field}
                                    value={dayjs(field.value)}
                                    onChange={(value) => {
                                        setValue(field.name, value.format('YYYY-MM-DD'));
                                    }}
                                    format='dddd, MMMM D'
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
                <Grid item xs={4}>
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
                                            setValue(field.name, value.format('HH:mm:ss'));
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
                <Grid item xs={4}>
                    <Controller
                        control={control}
                        name='category'
                        render={({ field }) => (
                            <CategoryAutocomplete
                                {...field}
                                ref={null}
                                value={watch('category') ?? null}
                                onChange={(_event, newValue) => {
                                    setManuallySetCategory(Boolean(newValue))
                                    setValue(field.name, newValue);
                                }}
                            />
                        )}
                    />
                </Grid>
            </Grid>
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
            {showAdvancedControls && (
                <Box mb={1}>
                    <Typography variant='overline'><strong>Money Out</strong></Typography>
                </Box>
            )}
            <Stack mb={2} spacing={2}>
                {debitTransactionFields.map(([field, index]) => {
                    return (
                        <JournalEntryTransactionRow
                            key={field.id}
                            index={index}
                            fieldArray={transactionsFieldArray}
                            showAdvancedControls={showAdvancedControls}
                        />
                    )
                })}
            </Stack>
            {showAdvancedControls && (
                <Button startIcon={<Add />} onClick={() => addDebitTransaction()}>Add Transaction</Button>
            )}
            {showAdvancedControls && (
                <>
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
                                    showAdvancedControls={showAdvancedControls}
                                />
                            )
                        })}
                    </Stack>
                    <Button startIcon={<Add />} onClick={() => addCreditTransaction()}>Add Transaction</Button>
                </>
            )}
        </>
    )
}
