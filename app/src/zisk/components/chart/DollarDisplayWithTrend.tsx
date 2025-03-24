import { formatBasisPointsDiff, getPriceString, PriceStringOptions } from "@/utils/string"
import { InfoOutlined, TrendingDown, TrendingFlat, TrendingUp } from "@mui/icons-material"
import { alpha, Chip, Stack, Tooltip, Typography, useTheme } from "@mui/material"

interface DollarDisplayWithTrendProps {
    price: number
    label: string
    color?: string
    priceStringOptions?: PriceStringOptions
    diff?: {
        basisPoints: number
        description: string
    }
}

const POSITIVE_TREND_BP_THRESHOLD = 400
const NEGATIVE_TREND_BP_THRESHOLD = -400

export function DollarDisplayWithTrend(props: DollarDisplayWithTrendProps) {
    const theme = useTheme()

    let diffColor: undefined | 'success' | 'error' = undefined
    let trendIcon = <TrendingFlat />
    if (props.diff) {
        if (props.diff.basisPoints >= POSITIVE_TREND_BP_THRESHOLD) {
            diffColor = "success"
            trendIcon = <TrendingUp />
        } else if (props.diff.basisPoints <= NEGATIVE_TREND_BP_THRESHOLD) {
            diffColor = "error"
            trendIcon = <TrendingDown />
        }
    }

    return (
        <Stack>
            <Typography variant='overline' sx={{ lineHeight: '1' }}>{props.label}</Typography>
            <Typography color={props.color} sx={{ fontWeight: 500 }}>
                {getPriceString(props.price, props.priceStringOptions)}
            </Typography>
            {props.diff && (
                <Stack direction='row' alignItems='center' gap={0.5} mr={-1}>
                    <Chip
                        color={diffColor}
                        sx={{
                            backgroundColor: diffColor ? alpha(theme.palette[diffColor].main, 0.325) : undefined,
                            color: diffColor ? theme.palette.getContrastText(theme.palette.background.paper) : undefined,
                        }}
                        label={formatBasisPointsDiff(props.diff.basisPoints)}
                        icon={trendIcon}
                        size='small'
                    />
                    <Tooltip title={props.diff.description}>
                        <InfoOutlined fontSize='small' sx={{ cursor: 'pointer' }} />
                    </Tooltip>
                </Stack>
            )}
        </Stack>
    )
}
