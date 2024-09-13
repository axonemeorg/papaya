'use client';

import { AutocompleteProps, Avatar, Box, Button, ButtonGroup, Fade, Grid, Icon, InputLabel, Select, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { CreateTransactionMethod } from "@/types/post";
import PaymentTypeAutocomplete from "../input/PaymentTypeAutocomplet";
import { PaymentType } from "@/types/enum";
import { TransactionMethodContext } from "@/contexts/TransactionMethodContext";
import IconPicker from "../icon/IconPicker";
import { InsertEmoticon, Photo, TextFields } from "@mui/icons-material";
import ColorPicker, { getMuiColor } from "../pickers/ColorPicker";

export default function TransactionMethodForm() {
    const { transactionMethods } = useContext(TransactionMethodContext);
    const { register, control, setValue, watch } = useFormContext<CreateTransactionMethod>();

    const primaryColor = getMuiColor(watch('avatarPrimaryColor'));
    const secondaryColor = getMuiColor(watch('avatarSecondaryColor'));

    return (
        <Box>
            <Stack alignItems='center' sx={{ width: '100%' }} gap={0.5}>
                <Avatar
                    sx={{ width: 48, height: 48, background: `linear-gradient(60deg, ${primaryColor} 20%, ${secondaryColor} 90%)` }}
                >
                    {watch('avatarVariant') === 'PICTORIAL' ? (
                        <Icon fontSize="large">{watch('avatarContent')}</Icon>
                    ) : (
                        <Typography variant='inherit'>
                            {watch('avatarContent')}
                        </Typography>
                    )}
                </Avatar>
                <Fade in={Boolean(watch('label'))}>
                    <Typography>&zwnj;{watch('label')}</Typography>
                </Fade>
            </Stack>
            <InputLabel sx={{ mb: 0.5 }}>Icon</InputLabel>
            {/* <Controller<CreateTransactionMethod>
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
            /> */}
            <Stack direction='row' gap={1} mb={2}>
                <Controller<CreateTransactionMethod>
                    name='avatarContent'
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
                    name='avatarPrimaryColor'
                    control={control}
                    render={({ field }) => (
                        <ColorPicker
                            color={field.value}
                            onChange={(newColor) => setValue(field.name, newColor)}
                        />
                    )}
                />
                <Controller<CreateTransactionMethod>
                    name='avatarSecondaryColor'
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
