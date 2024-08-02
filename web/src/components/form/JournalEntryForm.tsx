'use client';

import { Box, Button, Collapse, Grid, Icon, IconButton, InputAdornment, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Add, Delete } from "@mui/icons-material";
import DateTimePicker from "../date/DateTimePicker";
import TransactionMethodAutocomplete from "../input/TransactionMethodAutocomplete";
import { Controller, FieldArrayWithId, useFieldArray, UseFieldArrayReturn, useFormContext } from "react-hook-form";
import { CreateJournalEntry } from "@/types/post";
import { TransactionType } from "@/types/enum";
import CategoryAutocomplete from "../input/CategoryAutocomplete";
import { findMostSimilarCategory } from "@/actions/category-actions";
import { debounce } from "@/utils/Utils";

interface JournalEntryTransactionRowProps {
    index: number;
    showAdvancedControls: boolean;
    fieldArray: UseFieldArrayReturn<CreateJournalEntry>;
}

const JournalEntryTransactionRow = (props: JournalEntryTransactionRowProps) => {
    const { setValue, control } = useFormContext<CreateJournalEntry>();

    return (
        <Stack direction='row' spacing={1} alignItems='center'>
            <Controller
                control={control}
                name={`transactions.${props.index}.amount` as const}
                render={({ field }) => (
                    <TextField
                        label='Amount'
                        {...field}
                        onChange={(event) => {
                            const value = event.target.value === ''
                                ? undefined
                                : Number(event.target.value);
                            field.onChange(value);
                        }}
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ flex: 1 }}
                    />
                )}
            />

            <Controller
                control={control}
                name={`transactions.${props.index}.transactionMethod` as const}
                render={({ field }) => (
                    <TransactionMethodAutocomplete
                        {...field}
                        value={field.value}
                        onChange={(_event, newValue) => {
                            setValue(field.name, newValue);
                            setValue(`transactions.${props.index}.paymentType`, newValue.defaultPaymentType)
                        }}
                    />
                )}
            />
            {/* <DateTimePicker /> */}
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
            <Grid container columns={2} spacing={1}>
                <Grid item xs={1}>
                    <Controller
                        control={control}
                        name='memo'
                        render={({ field }) => (
                            <TextField
                                name='memo'
                                label='Memo'
                                {...field}
                                value={field.value}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    handleDetectCategoryWithAi(value);
                                    setValue(field.name, value);
                                }}
                                fullWidth
                                multiline
                                maxRows={3}
                                sx={{ mb: 2 }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={1}>
                    <Controller
                        control={control}
                        name='category'
                        render={({ field }) => (
                            <CategoryAutocomplete
                                {...field}
                                value={watch('category')}
                                onChange={(_event, newValue) => {
                                    setValue(field.name, newValue);
                                }}
                            />
                        )}
                    />
                </Grid>
            </Grid>
            {showAdvancedControls && (
                <Box mb={1}>
                    <Typography variant='overline'>Money Out</Typography>
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
                        <Typography variant='overline'>Money In</Typography>
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
