'use client';

import { AutocompleteProps, Avatar, Box, Button, ButtonGroup, Fade, Grid, Icon, InputLabel, Select, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { CreateTransactionMethod } from "@/types/post";
import PaymentTypeAutocomplete from "../input/PaymentTypeAutocomplet";
import { PaymentType, TransactionMethodIconVariant } from "@/types/enum";
import { TransactionMethodContext } from "@/contexts/TransactionMethodContext";
import IconPicker from "../icon/IconPicker";
import { InsertEmoticon, Photo, TextFields } from "@mui/icons-material";
import ColorPicker from "../color/ColorPicker";

export default function TransactionMethodForm() {
    const { transactionMethods } = useContext(TransactionMethodContext);
    const { register, control, setValue, watch } = useFormContext<CreateTransactionMethod>();

    return (
        <Box>
            <Stack alignItems='center' sx={{ width: '100%' }} gap={0.5}>
                <Avatar>
                    {watch('iconVariant') === 'PICTORIAL' ? (
                        <Icon>{watch('iconContent')}</Icon>
                    ) : (
                        <Typography variant='inherit'>
                            {watch('iconContent')}
                        </Typography>
                    )}
                </Avatar>
                <Fade in={Boolean(watch('label'))}>
                    <Typography>&zwnj;{watch('label')}</Typography>
                </Fade>
            </Stack>
            <InputLabel sx={{ mb: 0.5 }}>Icon Type</InputLabel>
            <Controller<CreateTransactionMethod>
                name='iconVariant'
                control={control}
                render={({ field }) => (
                    <ToggleButtonGroup
                        {...field}
                        exclusive
                        orientation="horizontal"
                        onChange={(_event, value) => {
                            setValue(field.name, value);
                        }}
                    >
                        <ToggleButton value={TransactionMethodIconVariant.Enum.PICTORIAL}>
                            <InsertEmoticon />
                        </ToggleButton>
                        <ToggleButton value={TransactionMethodIconVariant.Enum.TEXT}>
                            <TextFields />
                        </ToggleButton>
                        <ToggleButton disabled value={TransactionMethodIconVariant.Enum.IMAGE}>
                            <Photo />
                        </ToggleButton>
                    </ToggleButtonGroup>
                )}
            />
            <Stack direction='row'>
                <Controller<CreateTransactionMethod>
                    name='iconContent'
                    control={control}
                    render={({ field }) => (
                        <IconPicker
                            icon={field.value}
                            onChangeIcon={(icon) => setValue(field.name, icon)}
                            renderButton={(icon) => (
                                <Select

                                />
                            )}
                        />
                    )}
                />
                <Controller<CreateTransactionMethod>
                    name='iconPrimaryColor'
                    control={control}
                    render={({ field }) => (
                        <ColorPicker
                            color={field.value}
                            onChange={(newColor) => setValue(field.name, newColor)}
                        />
                    )}
                />
                <Controller<CreateTransactionMethod>
                    name='iconSecondaryColor'
                    control={control}
                    render={({ field }) => (
                        <ColorPicker
                            color={field.value}
                            onChange={(newColor) => setValue(field.name, newColor)}
                        />
                    )}
                />
            </Stack>
            <Grid container direction='row' columns={2} spacing={1} alignItems='center'>
                <Grid item xs={1}>
                    <TextField
                        {...register('label')}
                        label='Label'
                        placeholder="My Mastercard"
                        fullWidth
                        multiline
                        maxRows={3}
                    />
                </Grid>
                <Grid item xs={1}>
                <Controller<CreateTransactionMethod>
                    name='defaultPaymentType'
                    control={control}
                    render={({ field }) => (
                        <PaymentTypeAutocomplete
                            renderInput={(params) => <TextField {...params} label="Default Payment Type" />}
                            {...field}
                            value={field.value as PaymentType}
                            onChange={(_event, newValue) => setValue(field.name, newValue)}                            
                        />
                    )}
                />
                </Grid>
            </Grid>
        </Box>
    )
}
