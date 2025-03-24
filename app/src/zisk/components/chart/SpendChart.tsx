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
import { alpha, Box, Card, CardContent, Skeleton, Stack, useTheme } from '@mui/material';
import { DollarDisplayWithTrend } from './DollarDisplayWithTrend';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Filler,
    Legend
);

export default function SpendChart() {

    const journalSliceContext = useContext(JournalSliceContext)

    const theme = useTheme()

    const { analyticsQuery } = journalSliceContext;
    const { chart, sumGain, sumLoss } = analyticsQuery.data.basic

    const { chartOptions, chartData } = useMemo(() => {
        const color = chart.data[0] < chart.data[chart.data.length - 1] ? theme.palette.success.main : theme.palette.error.main
        const chartData = {
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
                    y: {
                      from: 0
                    }
                  }
                },
                hide: {
                  animations: {
                    y: {
                      to: 0
                    }
                  }
                }
              },
              maintainAspectRatio: false,
        }

        return { chartData, chartOptions }
    }, [chart])

    const isLoading = !analyticsQuery.isFetched || analyticsQuery.isLoading || !analyticsQuery.data.basic.chart.data.length

    return (
        <Card sx={{
            borderRadius: theme.spacing(2),
        }}>
            <CardContent sx={{ pb: 0.5, position: 'relative', zIndex: 2 }}>
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
                                // diff={{
                                //     basisPoints: 100,
                                //     description: 'Since last month'
                                // }}
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
                    <Line options={chartOptions} data={chartData} width={'100%'} />
                </Box>
            ) : (
                <Skeleton variant='rectangular' height={theme.spacing(10)} />
            )}
        </Card>
    )
}
