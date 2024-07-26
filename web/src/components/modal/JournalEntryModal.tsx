'use client';

import { Add } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent,  DialogTitle} from "@mui/material";
import JournalEntryForm from "../form/JournalEntryForm";


export default function JournalEntryModal() {
    return (
        <Dialog open={true} fullWidth>
            <DialogTitle>Add Entry</DialogTitle>
            <DialogContent>
                <JournalEntryForm />
            </DialogContent>
            <DialogActions>
                <Button>Cancel</Button>
                <Button variant='contained' startIcon={<Add />}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}
