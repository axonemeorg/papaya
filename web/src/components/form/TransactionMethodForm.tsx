'use client';

import { Grid, TextField } from "@mui/material";
import { useState } from "react";
import TransactionMethod from "../input/TransactionMethod";
import { Add, Delete } from "@mui/icons-material";
import DateTimePicker from "../date/DateTimePicker";
import PaymentType from "../input/PaymentType";
import { useFormContext } from "react-hook-form";
import { CreateTransactionMethod } from "@/types/post";

export default function TransactionMethodForm() {
    const { register } = useFormContext<CreateTransactionMethod>();

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
                    <PaymentType />
                </Grid>
            </Grid>
        </>
    )
}
