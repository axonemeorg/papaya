'use client'

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import TransactionMethodForm from "../form/TransactionMethodForm";
import { Add } from "@mui/icons-material";
import { CreateTransactionMethod } from "@/types/post";
import { boolean } from "drizzle-orm/mysql-core";
import { useState } from "react";
import { createTransactionMethod } from "@/actions/method-actions";
import { FormProvider, useForm } from "react-hook-form";
import { PaymentType } from "@/types/enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";

interface TransactionMethodModalProps {
    open: boolean;
    onClose: () => void;
}

export default function TransactionMethodModal(props: TransactionMethodModalProps) {
    const [saving, setSaving] = useState<boolean>(false);

    const handleCreateTransactionMethod = (formData: CreateTransactionMethod) => {
        setSaving(true);
        createTransactionMethod(formData)
            .then(() => {
                props.onClose();
            })
            .catch(() => {

            })
            .finally(() => {
                setSaving(false);
            })
    }

    const createTransactionMethodForm = useForm<CreateTransactionMethod>({
        defaultValues: {
            label: '',
            defaultPaymentType: PaymentType.Enum.CREDIT,
            avatarContent: 'credit_card',
            avatarPrimaryColor: 'red.400',
            avatarSecondaryColor: 'red.400',
            avatarVariant: 'PICTORIAL',
        },
        resolver: zodResolver(CreateTransactionMethod)
    });

    return (
        <FormProvider {...createTransactionMethodForm}>
            <Dialog open={props.open} fullWidth onClose={props.onClose}>
                <form onSubmit={createTransactionMethodForm.handleSubmit(handleCreateTransactionMethod)}>
                    <DialogTitle>Add Transaction Method</DialogTitle>
                    <DialogContent>
                        <DialogContentText mb={4}>Transaction methods indicate how your money is being spent.</DialogContentText>
                        <TransactionMethodForm />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => props.onClose()}>Cancel</Button>
                        <LoadingButton loading={saving} type='submit' variant='contained' startIcon={<Add />}>Add</LoadingButton>
                    </DialogActions>
                </form>
            </Dialog>
        </FormProvider>
    )
}
