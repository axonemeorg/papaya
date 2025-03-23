import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Filler,
    Legend,
  } from 'chart.js';
import { useContext, useMemo } from 'react';
import { JournalSliceContext } from '@/contexts/JournalSliceContext';
import { alpha, Box, Card, CardContent, Chip, Skeleton, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { formatBasisPointsDiff, getPriceString, PriceStringOptions } from '@/utils/string';
import { InfoOutlined, TrendingDown, TrendingFlat, TrendingUp } from '@mui/icons-material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Filler,
    Legend
);

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

export default function SpendChart() {

    const journalSliceContext = useContext(JournalSliceContext)

    const theme = useTheme()

    const { basicAnalyticsQuery } = journalSliceContext;
    const { chart, sumGain, sumLoss } = basicAnalyticsQuery.data

    const { chartOptions, data } = useMemo(() => {
        const color = chart.data[0] < chart.data[chart.data.length - 1] ? theme.palette.success.main : theme.palette.error.main
        const data = {
            labels: chart.labels,
            datasets: [
                {
                    fill: "start",
                    data: chart.data,
                    borderColor: color,
                    backgroundColor: alpha(color, 0.1),
                },
            ],
        }

        const chartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    min: 1.25 * Math.min(...chart.data),
                    max: Math.max(...chart.data),
                    // ticks: {
                    //     stepSize: 2000,
                    // },
                    display: false,
                }
            },
            elements: {
                point:{
                    radius: 0
                },
            },
            tension: 0.25,
            transitions: {
                show: {
                  animations: {
                    // x: {
                    //   from: 0
                    // },
                    y: {
                      from: 0
                    }
                  }
                },
                hide: {
                  animations: {
                    // x: {
                    //   to: 0
                    // },
                    y: {
                      to: 0
                    }
                  }
                }
              },
              maintainAspectRatio: false,
        }

        return { data, chartOptions }
    }, [chart])

    const isLoading = !basicAnalyticsQuery.isFetched || basicAnalyticsQuery.isLoading || !basicAnalyticsQuery.data.chart.data.length

    return (
        <Card sx={{
            borderRadius: theme.spacing(2),
        }}>
            <CardContent sx={{ pb: 0.5 }}>
                <Stack gap={0.5} sx={{ flexFlow: 'row wrap', justifyContent: 'space-between', width: theme.spacing(30) }}>
                    {!isLoading ? (
                        <>
                            <DollarDisplayWithTrend
                                label='Spend'
                                price={sumLoss}
                                priceStringOptions={{
                                    round: true,
                                    sign: 'never',
                                }}
                            />
                            <DollarDisplayWithTrend
                                label='Earned'
                                price={sumGain}
                                color='success'
                                priceStringOptions={{
                                    round: true,
                                    sign: 'never',
                                }}
                            />
                            <DollarDisplayWithTrend
                                label='Saved'
                                price={sumGain - sumLoss}
                                color={(sumGain - sumLoss) > 0 ? 'success' : 'error'}
                                diff={{
                                    basisPoints: 100,
                                    description: 'Since last month'
                                }}
                                priceStringOptions={{
                                    round: true,
                                    sign: 'always',
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <Skeleton variant='rectangular' width={theme.spacing(7)} height={theme.spacing(5)} />
                            <Skeleton variant='rectangular' width={theme.spacing(7)} height={theme.spacing(5)} />
                            <Skeleton variant='rectangular' width={theme.spacing(7)} height={theme.spacing(5)} />
                        </>
                    )}
                </Stack>
            </CardContent>
            {!isLoading ? (
                <Box sx={{ height: theme.spacing(12), boxSizing: 'border-box', p: 0, mx: -0.5, mt: -2 }}>
                    <Line options={chartOptions} data={data} width={'100%'} />
                </Box>
            ) : (
                <Skeleton variant='rectangular' height={theme.spacing(10)} />
            )}
        </Card>
    )
}
