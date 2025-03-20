import { SxProps, useTheme } from "@mui/material"

type GetPriceStyle = (amount: number) => SxProps

export const useGetPriceStyle = (): GetPriceStyle => {
    const theme = useTheme();

    return (netAmount: number): SxProps => {
        
        let color = undefined;
        let textDecoration = undefined;

        if (netAmount > 0) {
            color = theme.palette.success.main
        } else if (netAmount === 0) {
            color = theme.palette.text.secondary
            // textDecoration = 'line-through'
        }

        return { color, textDecoration }
    }
}
