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
            defaultPaymentType: PaymentType.Enum.CREDIT
        },
        resolver: zodResolver(CreateTransactionMethod)
    });

    

    return (
        <FormProvider {...createTransactionMethodForm}>
            <form onSubmit={createTransactionMethodForm.handleSubmit(handleCreateTransactionMethod)}>
                <Dialog open={props.open} fullWidth onClose={props.onClose}>
                    <DialogTitle>Add Transaction Method</DialogTitle>
                    <DialogContent>
                        <DialogContentText mb={4}>Transaction methods indicate how your money is being spent.</DialogContentText>
                        <TransactionMethodForm />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => props.onClose()}>Cancel</Button>
                        <Button type='submit' variant='contained' startIcon={<Add />}>Add</Button>
                    </DialogActions>
                </Dialog>
            </form>
        </FormProvider>
    )
}