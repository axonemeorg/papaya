'use client'

import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export default function DateTimePicker() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDateTimePicker

            />
        </LocalizationProvider>
    );
}
