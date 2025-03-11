import { CalendarMonth } from "@mui/icons-material";
import { Grow, IconButton, InputAdornment, Paper, Popper, TextField, TextFieldProps } from "@mui/material";
import { StaticDatePicker, LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { type Dayjs } from "dayjs";
import { useRef } from "react";

const format = 'ddd, MMM D'

interface DateFieldProps extends Omit<TextFieldProps<'filled'>, 'value' | 'onChange'> {
    value: Dayjs
    onChange: (value: Dayjs) => void
}

export default function DateField(props: DateFieldProps) {
    const { value, onChange, ...rest } = props

    const inputRef = useRef(null)
    const textfieldRef = useRef(null)
    const handleClickButton = () => {

    }

    

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Popper
                id='aaaaa'
                open={true}
                anchorEl={textfieldRef.current}
                sx={{ zIndex: 1200 }}
                transition
                placement="top-start"
            >
                {({ TransitionProps }) => (
                    <Grow {...TransitionProps} timeout={350}>
                        <Paper>
                            <DateCalendar />
                        </Paper>
                    </Grow>
                )}
            </Popper>
            <TextField
                inputRef={inputRef}
                ref={textfieldRef}
                {...rest}
                slotProps={{
                    ...rest.slotProps,
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={'select date'}
                                    onClick={handleClickButton}
                                    edge="end"
                                >
                                    <CalendarMonth />
                                </IconButton>
                            </InputAdornment>
                        ),
                        ...rest.slotProps?.input,
                    }
                }}
                
            />
        </LocalizationProvider>
    )
}
