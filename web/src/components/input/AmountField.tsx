
import { SwapHoriz } from "@mui/icons-material";
import { TextField, InputAdornment, TextFieldProps, Stack } from "@mui/material"
import { IconButton } from "@mui/material"
// import { ToggleButtonGroup, ToggleButton } from "@mui/material"

type AmountFieldProps = TextFieldProps

export default function AmountField(props: AmountFieldProps) {
    const value = String(props.value ?? '');
    const isIncome = value.startsWith('+')

    const toggleSign = () => {
        const event = new Event('change', { bubbles: true });
        const syntheticEvent = {
            ...event,
            target: {
                ...event.target,
                value: isIncome ? value.slice(1) : '+' + value,
            },
        };

        props.onChange?.(syntheticEvent as unknown as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value
        const trailingCharacter = value[value.length - 1]
        if (isIncome && trailingCharacter === '-') {
            toggleSign()
            return
        } else if (!isIncome && trailingCharacter === '+') {
            toggleSign()
            return
        }

        const newValue = value
            .replace(/[^0-9.,+]/g, '') // Remove non-numeric characters except for dot, comma, or plus sign
            .replace(/(\..*?)\..*/g, '$1') // Allow only one dot
            .replace(/(\.\d{2})\d+/g, '$1') // Limit to two decimal places
            .replace(/[-+](?!.)/g, '') // Remove any pluses or minuses that are not at the beginning of the string

        props.onChange?.({ ...event, target: { ...event.target, value: newValue } })
    }

    const { slotProps, sx, ...rest } = props

    return (
        <Stack direction='row' gap={1}>
            <TextField
                label="Amount"
                placeholder="00.00"
                fullWidth
                slotProps={{
                    htmlInput: {
                        inputMode: 'decimal',
                    },
                    input: {  
                        startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                        ),
                        endAdornment: (
                            <IconButton onClick={() => toggleSign()}>
                                <SwapHoriz />
                            </IconButton>
                        ),
                        sx: (theme) => ({
                            color: isIncome ? theme.palette.success.main : undefined,
                        }),
                    },
                }}
                sx={{ flex: 1 }}
                autoComplete="off"
                {...rest}
                onChange={handleChange}
                value={value}
            />
            {/* <ToggleButtonGroup
                color='primary'
                value={isIncome ? 'income' : 'expense'}
                exclusive
                onChange={() => toggleSign()}
            >
                <ToggleButton value='income' tabIndex={isIncome ? -1 : undefined}>Income</ToggleButton>
                <ToggleButton value='expense' tabIndex={isIncome ? undefined : -1}>Expense</ToggleButton>
            </ToggleButtonGroup> */}
        </Stack>
    )
}
