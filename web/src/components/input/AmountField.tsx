
import { SwapHoriz } from "@mui/icons-material";
import { TextField, InputAdornment, TextFieldProps, IconButton } from "@mui/material"

type AmountFieldProps = TextFieldProps

export const AMOUNT_VALIDATION_PATTERN = /[-+]?\d{1,3}(,\d{3})*(\.\d+)?/;

export default function AmountField(props: AmountFieldProps) {
    const value = String(props.value ?? '');
    const isIncome = value.startsWith('+')

    const toggleSign = () => {
        const syntheticEvent = isIncome
            ? { target: { value: value.slice(1) } }
            : { target: { value: '+' + value } };

        props.onChange?.(syntheticEvent)
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

        props.onChange?.({ ...event, target: { ...event.target, value: newValue } })
    }

    const { slotProps, sx, ...rest } = props

    return (
        <TextField
            label="Amount"
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
    )
}
