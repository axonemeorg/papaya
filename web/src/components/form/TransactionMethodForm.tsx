'use client';

import { Grid, TextField } from "@mui/material";
import { useState } from "react";
import TransactionMethod from "../input/TransactionMethodAutocomplete";
import { Add, Delete } from "@mui/icons-material";
import DateTimePicker from "../date/DateTimePicker";
import { Controller, useFormContext } from "react-hook-form";
import { CreateTransactionMethod } from "@/types/post";
import PaymentTypeAutocomplete from "../input/PaymentTypeAutocomplet";
import { PaymentType } from "@/types/enum";

export default function TransactionMethodForm() {
    const { register, control, setValue } = useFormContext<CreateTransactionMethod>();

    return (
        <>
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
        </>
    )
}
