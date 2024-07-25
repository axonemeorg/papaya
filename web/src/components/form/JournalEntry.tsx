import { Add } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputAdornment, TextField } from "@mui/material";


export default function JournalEntry() {
    return (
        <Dialog open={true} fullWidth>
            <DialogTitle>Add Entry</DialogTitle>
            <DialogContent>
                <Grid container columns={2} spacing={1}>
                    <Grid item xs={1}>
                        <TextField
                            name='amount'
                            label='Amount'
                            fullWidth
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <TextField
                            name='method'
                            label='Method'
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            name='memo'
                            label='Memo'
                            fullWidth
                            multiline
                            minRows={2}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button>Cancel</Button>
                <Button variant='contained' startIcon={<Add />}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}
