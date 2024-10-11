'use client';

import { Box, Button, Card, CardActionArea, CardMedia, Chip, Collapse, FormHelperText, Grid2 as Grid, Icon, IconButton, InputAdornment, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import { Add, AddPhotoAlternate, Delete, Label, Photo } from "@mui/icons-material";
import { Controller, FieldArrayWithId, useFieldArray, UseFieldArrayReturn, useFormContext } from "react-hook-form";
import { CreateJournalEntry } from "@/types/post";
import { TransactionTag, TransactionType } from "@/types/enum";
import CategoryAutocomplete from "../input/CategoryAutocomplete";
import { debounce, getUserImagePublicUrlFromS3Key } from "@/utils/Utils";
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from "dayjs";
import { Category, type UserFileUpload } from "@/types/get";
import { findMostSimilarUserCategory } from "@/actions/category-actions";
import TransactionTagPicker from "../pickers/TransactionTagPicker";
import { TRANSACTION_TAG_LABELS } from "@/constants/transactionTags";
import { LoadingButton } from "@mui/lab";

interface JournalEntryTransactionRowProps {
    index: number;
    fieldArray: UseFieldArrayReturn<CreateJournalEntry>['fields'];
    remove: UseFieldArrayReturn<CreateJournalEntry>['remove'];
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

interface JournalEntryAttachmentThumbnailProps {
    /**
     * Source for the image. If no source is provided, a loading spinner is rendered.
     */
    imgSrc?: string;
    altText?: string;
}

const JournalEntryAttachmentThumbnail = (props: JournalEntryAttachmentThumbnailProps) => {
    return (
        <Card>
            <CardActionArea>
                <CardMedia
                    component="img"
                    width={72}
                    height={72}
                    image={props.imgSrc}
                    alt={props.altText}
                />
            </CardActionArea>
        </Card>
    )
}

interface JournalEntryAttachmentRowProps {
    index: number;
    fieldArray: UseFieldArrayReturn<CreateJournalEntry>['fields'];
    remove: UseFieldArrayReturn<CreateJournalEntry>['remove'];
}

const JournalEntryAttachmentRow = (props: JournalEntryAttachmentRowProps) => {
    const { watch, register } = useFormContext<CreateJournalEntry>();

    const values = watch(`attachments.${props.index}`);
    const { s3Key } = values.fileUpload;
    const altText = values.memo ?? undefined;
    const imgSrc = getUserImagePublicUrlFromS3Key(s3Key);

    return (
        <Grid container columns={12} spacing={1} rowSpacing={0} sx={{ alignItems: 'flex-start' }}>
            <Grid size={'auto'}>
                <JournalEntryAttachmentThumbnail
                    imgSrc={imgSrc}
                    altText={altText}
                />
            </Grid>
            <Grid size={'grow'}>
                <TextField
                    label='Memo'
                    placeholder="Describe this attachment"
                    {...register(`attachments.${props.index}.memo`)}
                    fullWidth
                    multiline
                    minRows={1}
                    maxRows={2}
                    size='small'
                />
            </Grid>
            <Grid size='auto'>
                <IconButton
                    onClick={() => props.remove(props.index)}
                >
                    <Delete />
                </IconButton>
            </Grid>
        </Grid>
    )
}

interface JournalEntryAttachmentFormProps {
    onImageUploadSuccess: (data: UserFileUpload) => void;
}

const JournalEntryAttachmentForm = (props: JournalEntryAttachmentFormProps) => {
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClickUploadButton = () => {
      fileInputRef?.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploading(true);
            setUploadError(null);

            try {
                const formData = new FormData();
                formData.append('file', file);

                // Send the file to your API endpoint
                const response = await fetch('/api/upload/attachment', {
                    method: 'POST',
                    body: formData,
                });

                const data: UserFileUpload = await response.json();
                props.onImageUploadSuccess(data);
            } catch (err) {
                setUploadError((err as Error).message);
            } finally {
                setUploading(false);
            }
        }
    }

    return (
        <>
            <input
                type="file"
                onChange={handleFileChange}
                disabled={uploading}
                style={{ display: 'none' }}
                ref={fileInputRef}
            />
            <Stack direction='row' sx={{ mb: 1 }} gap={2}>
                {/* {hasImageIcon && (
                    <>
                        <ImageAvatar
                            avatar={props.value}
                            sx={uploading ? {
                                filter: 'blur(2px)',
                                opacity: 0.5,
                            } : undefined}
                        />
                        <Button
                            variant='text'
                            onClick={() => handleRemoveImage()}
                            startIcon={<RemoveCircle />}
                        >
                            Remove
                        </Button>
                    </>
                )} */}
                <LoadingButton
                    onClick={handleClickUploadButton}
                    loading={uploading}
                    startIcon={<AddPhotoAlternate />}
                >
                    Add Attachment
                </LoadingButton>
            </Stack>            
            {uploadError && (
                <FormHelperText error>{uploadError}</FormHelperText>
            )}
        </>
    )
}

export default function JournalEntryForm() {
    const [manuallySetCategory, setManuallySetCategory] = useState<boolean>(false);
    const [transactionTagPickerData, setTransactionTagPickerData] = useState<{ anchorEl: Element | null, index: number }>({
        anchorEl: null,
        index: 0,    
    });

    const enableAutoDetectCategory = false;

    const { watch, control, getValues, setValue, formState } = useFormContext<CreateJournalEntry>();

    console.log('JournalEntryForm.watch:', watch());
    console.log('JournalEntryForm.formState.errors:', formState.errors);


    const {
        fields: attachmentFieldArray,
        append: appendAttachment,
        remove: removeAttachment,
    } = useFieldArray<CreateJournalEntry>({
        control,
        name: 'attachments',
    });

    const {
        fields: transactionsFieldArray,
        append: appendTransaction,
        remove: removeTransaction,
    } = useFieldArray<CreateJournalEntry>({
        control,
        name: 'transactions',
    });

    const addDebitTransaction = () => {
        appendTransaction({
            amount: '',
            memo: '',
            paymentType: undefined,
            transactionMethod: undefined,
            transactionType: TransactionType.Enum.DEBIT,
            tags: [],
        });
    }

    const addCreditTransaction = () => {
        appendTransaction({
            amount: '',
            memo: '',
            paymentType: undefined,
            transactionMethod: undefined,
            transactionType: TransactionType.Enum.CREDIT,
            tags: [],
        });
    }

    const addAttachment = (data: UserFileUpload) => {
        appendAttachment({
            fileUpload: data,
            memo: '',
        });
    }

    const attachmentFields = attachmentFieldArray.map((field, index: number): [FieldArrayWithId<CreateJournalEntry>, number] => {
        return [field, index]
    });

    const transactions = getValues('transactions');
    const transactionFields = transactionsFieldArray.map((field, index: number): [FieldArrayWithId<CreateJournalEntry>, number] => {
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
                                    remove={removeTransaction}
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
                                    remove={removeTransaction}
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
                        {attachmentFields.map(([field, index]) => {
                            return (
                                <JournalEntryAttachmentRow
                                    key={field.id}
                                    index={index}
                                    remove={removeAttachment}
                                    fieldArray={transactionsFieldArray}
                                />
                            )
                        })}
                        <JournalEntryAttachmentForm
                            onImageUploadSuccess={addAttachment}
                        />
                    </Stack>
                </Box>
            </Stack>
        </>
    )
}
