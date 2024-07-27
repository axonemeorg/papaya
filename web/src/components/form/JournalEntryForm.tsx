'use client';

import { Box, Button, Collapse, Grid, Icon, IconButton, InputAdornment, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Add, Delete } from "@mui/icons-material";
import DateTimePicker from "../date/DateTimePicker";
import TransactionMethodAutocomplete from "../input/TransactionMethodAutocomplete";


export default function JournalEntryForm() {
    const [formTab, setFormTab] = useState(1);

    const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
      setFormTab(newValue);
    };

    const showAdvancedControls = formTab === 1;

    return (
        <>
            <Box mb={2}>
                <Tabs value={formTab} onChange={handleChangeTab} centered>
                    <Tab label="Quick" />
                    <Tab label="Advanced" />
                </Tabs>
            </Box>
            <TextField
                name='memo'
                label='Memo'
                fullWidth
                multiline
                maxRows={3}
                sx={{ mb: 2 }}
            />
            {showAdvancedControls && (
                <Box mb={1}>
                    <Typography variant='overline'>Money Out</Typography>
                </Box>
            )}
            <Stack mb={2}>
                <Stack direction='row' spacing={1} alignItems='center'>
                    <TextField
                        name='amount'
                        label='Amount'
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ flex: 1 }}
                    />
                    <TransactionMethodAutocomplete />
                    <DateTimePicker />
                    {showAdvancedControls && (
                        <IconButton>
                            <Delete />
                        </IconButton>
                    )}
                </Stack>
            </Stack>
            {showAdvancedControls && (
                <>
                    <Box mb={1}>
                        <Typography variant='overline'>Money In</Typography>
                    </Box>
                    <Button startIcon={<Add />}>Add Transaction</Button>
                </>
            )}
        </>
    )
}
