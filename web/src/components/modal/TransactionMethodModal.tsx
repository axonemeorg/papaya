import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import TransactionMethodForm from "../form/TransactionMethodForm";
import { Add } from "@mui/icons-material";

interface TransactionMethodModalProps {
    open: boolean;
    onClose: () => void;
}

export default function TransactionMethodModal(props: TransactionMethodModalProps) {
    return (
        <Dialog open={props.open} fullWidth onClose={props.onClose}>
            <DialogTitle>Add Transaction Method</DialogTitle>
            <DialogContent>
                <DialogContentText mb={4}>Transaction methods indicate how your money is being spent.</DialogContentText>
                <TransactionMethodForm />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose()}>Cancel</Button>
                <Button variant='contained' startIcon={<Add />}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}