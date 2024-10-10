'use client';

import { Box, Button, Chip, Collapse, Divider, Grid2 as Grid, Icon, IconButton, InputAdornment, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { Add, Delete, Label, Photo } from "@mui/icons-material";
import { Controller, FieldArrayWithId, useFieldArray, UseFieldArrayReturn, useFormContext } from "react-hook-form";
import { CreateJournalEntry } from "@/types/post";
import { TransactionTag, TransactionType } from "@/types/enum";
import CategoryAutocomplete from "../input/CategoryAutocomplete";
import { debounce } from "@/utils/Utils";
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from "dayjs";
import { Category, Transaction, TransactionMethod } from "@/types/get";
import { findMostSimilarUserCategory } from "@/actions/category-actions";
import TransactionTagPicker from "../pickers/TransactionTagPicker";
import { TRANSACTION_TAG_LABELS } from "@/constants/transactionTags";

interface JournalEntryTransactionRowProps {
    index: number;
    fieldArray: UseFieldArrayReturn<CreateJournalEntry>;
    onClickTagButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const JournalEntryTransactionRow = (props: JournalEntryTransactionRowProps) => {
    const { setValue, control, watch } = useFormContext<CreateJournalEntry>();

    const transactionTags = watch(`transactions.${props.index}.tags`) ?? [];
    const hasTags = transactionTags.length > 0;

    return (
        
        <Grid container columns={12} spacing={1} rowSpacing={0} sx={{ alignItems: 'center' }}>
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
                            size="small"
                        />
                    )}
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
                            size='small'
                        />
                    )}
                />
            </Grid>
            <Grid size={4}>
                <TextField
                    label='Memo (Optional)'
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
                        onClick={() => props.fieldArray.remove(props.index)}
                        disabled={props.fieldArray.fields.length <= 1}
                    >
                        <Delete />
                    </IconButton>
                </Stack>
            </Grid>
            <Grid size={12}>
                <Collapse in={hasTags}>
                    <Stack gap={1} sx={{ pt: 1.25, pb: 0.75, flexFlow: 'row wrap' }}>
                        {transactionTags.map((tagRecord) => {
                            return (
                                <Chip
                                    size='small'
                                    key={tagRecord.tag}
                                    label={TRANSACTION_TAG_LABELS[tagRecord.tag]?.label}
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
    const [manuallySetCategory, setManuallySetCategory] = useState<boolean>(false);
    const [transactionTagPickerData, setTransactionTagPickerData] = useState<{ anchorEl: Element | null, index: number }>({
        anchorEl: null,
        index: 0,    
    });

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
            transactionType: TransactionType.Enum.DEBIT,
            tags: [],
        });
    }

    const addCreditTransaction = () => {
        transactionsFieldArray.append({
            amount: '',
            memo: '',
            paymentType: undefined,
            transactionMethod: undefined,
            transactionType: TransactionType.Enum.CREDIT,
            tags: [],
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

    const transactionTagPickerSelectedTags = useMemo(() => {
        console.log("TEST:", watch(`transactions.${transactionTagPickerData.index}`));
        return watch(`transactions.${transactionTagPickerData.index}.tags`).map((tagRecord) => {
            return tagRecord.tag;
        });
    }, [transactionTagPickerData.index, watch(`transactions.${transactionTagPickerData.index}.tags`)])

    return (
        <>
            <TransactionTagPicker
                anchorEl={transactionTagPickerData.anchorEl}
                onClose={() => setTransactionTagPickerData((prev) => ({ ...prev, anchorEl: null }))}
                value={transactionTagPickerSelectedTags}
                onChange={(tags: TransactionTag[]) => {
                    setValue(`transactions.${transactionTagPickerData.index}.tags`, tags.map((tag) => {
                        return { tag };
                    }));
                }}
            />
            <Stack gap={2}>
                <Grid container columns={12} spacing={1} rowSpacing={2}>
                    <Grid size={12}>
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
                                />
                            )}
                        />
                    </Grid>
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
                <Box>
                    <Box mb={1}>
                        <Typography variant='overline'><strong>Money Out</strong></Typography>
                    </Box>
                    <Stack spacing={1.5}>
                        {debitTransactionFields.map(([field, index]) => {
                            return (
                                <JournalEntryTransactionRow
                                    key={field.id}
                                    index={index}
                                    fieldArray={transactionsFieldArray}
                                    onClickTagButton={(event) => {
                                        setTransactionTagPickerData({
                                            anchorEl: event.currentTarget,
                                            index,
                                        })
                                    }}
                                />
                            )
                        })}
                        <Button
                            startIcon={<Add />}
                            onClick={() => addDebitTransaction()}
                            sx={{ alignSelf: 'flex-start' }}
                        >
                            Add Transaction
                        </Button>
                    </Stack>
                </Box>
                <Box>
                    <Box mb={1}>
                        <Typography variant='overline'><strong>Money In</strong></Typography>
                    </Box>
                    <Stack spacing={1.5}>
                        {creditTransactionFields.map(([field, index]) => {
                            return (
                                <JournalEntryTransactionRow
                                    key={field.id}
                                    index={index}
                                    fieldArray={transactionsFieldArray}
                                    onClickTagButton={(event) => {
                                        setTransactionTagPickerData({
                                            anchorEl: event.currentTarget,
                                            index,
                                        })
                                    }}
                                />
                            )
                        })}
                        <Button
                            startIcon={<Add />}
                            onClick={() => addCreditTransaction()}
                            sx={{ alignSelf: 'flex-start' }}
                        >
                            Add Transaction
                        </Button>
                    </Stack>
                </Box>
                <Box>
                    <Box mb={1}>
                        <Typography variant='overline'><strong>Attachments</strong></Typography>
                    </Box>
                    <Stack spacing={1.5}>
                        <Button
                            variant='outlined'
                            startIcon={<Photo />}
                            onClick={() => {}}
                            sx={{ alignSelf: 'flex-start' }}
                        >
                            Add Attachment
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </>
    )
}
