import { getFrequencyLabel, getMonthlyCadenceLabel, getMonthlyRecurrencesFromDate } from "@/utils/recurrence"
import { CadenceFrequency, DayOfWeek, MonthlyCadence, RecurringCadence, YearlyCadence } from "@/types/schema"
import { ArrowDownward, ArrowUpward } from "@mui/icons-material"
import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, IconButton, MenuItem, Select, SelectChangeEvent, SelectProps, Stack, TextField, ToggleButton, Typography } from "@mui/material"
import { ChangeEvent, useEffect, useMemo, useState } from "react"
import DaysOfWeekPicker from "../pickers/DaysOfWeekPicker"
import dayjs from "dayjs"

interface CustomRecurrenceModalProps extends Omit<DialogProps, 'onSubmit' | 'onClose'> {
    onSubmit: (cadence: RecurringCadence) => void
    onClose: () => void
}

function CustomRecurrenceModal(props: CustomRecurrenceModalProps) {
    const { onSubmit, ...rest } = props
    const [period, setPeriod] = useState<string | number>(1)
    const [frequency, setFrequency] = useState<CadenceFrequency>('MONTHLY')
    const [selectedWeekDays, setSelectedWeekDays] = useState<Set<DayOfWeek>>(new Set<DayOfWeek>())
    const [monthlyCadenceOptions, setMonthlyCadenceOptions] = useState<MonthlyCadence[]>([])
    const [selectedMonthlyCadenceOption, setSelectedMonthlyCadenceOption] = useState<number>(0)

    const [dateString, setDateString] = useState<string>('2025-01-01')

    const handleChangeFrequency = (event: SelectChangeEvent<CadenceFrequency>) => {
        setFrequency(event.target.value as CadenceFrequency)
    }

    const handleChangePeriod = (event: ChangeEvent<HTMLInputElement>) => {
        setPeriod(event.target.value)
    }

    const incrementPeriod = () => {
        setPeriod((prev) => (Number(prev || 0) + 1))
    }

    const decrementPeriod = () => {
        if (Number(period) > 1) {
            setPeriod((prev) => Number(prev) - 1)
        } else {
            setPeriod(1)
        }
    }

    const handleSubmit = () => {
        switch (frequency) {
            case 'YEARLY':
                return {
                    frequency: 'YEARLY',
                    period,
                }
            case 'DAILY':
                return {
                    frequency: 'DAILY',
                    period,
                }
            case 'MONTHLY':
            default:
                return {
                    ...monthlyCadenceOptions[selectedMonthlyCadenceOption],
                    period,
                }
            case 'WEEKLY': {
                return {
                    frequency: 'WEEKLY',
                    period,
                    days: Array.from(selectedWeekDays),
                }
            } 
        }
    }

    useEffect(() => {
        setSelectedMonthlyCadenceOption(0)
        setMonthlyCadenceOptions(getMonthlyRecurrencesFromDate(dateString))
        setSelectedWeekDays(new Set<DayOfWeek>([dayjs(dateString).format('ddd').toUpperCase() as DayOfWeek]))
    }, [dateString])

    return (
        <Dialog {...rest} maxWidth='xs' fullWidth>
            <DialogTitle>Custom recurrence</DialogTitle>
            <DialogContent>
                <TextField
                    color='error'
                    label={'Debug Date'}
                    value={dateString}
                    onChange={(event) => setDateString(event.target.value)}
                    sx={{ mt: 1 }}
                />
                <Stack spacing={1}>
                    <Stack direction='row' spacing={0.5} alignItems={'center'}>
                        <Typography sx={{ pr: 1 }}>Repeats every</Typography>
                        <TextField
                            hiddenLabel
                            value={period}
                            onChange={handleChangePeriod}
                            size='small'
                            autoComplete="new-password"
                            type='number'
                            variant='filled'
                            onBlur={() => {
                                if (!period || Number(period) <= 0) {
                                    setPeriod(1)
                                }
                            }}
                            slotProps={{
                                htmlInput: {
                                    sx: {
                                        width: '3ch',
                                        textAlign: 'center',
                                        '&::-webkit-inner-spin-button,::-webkit-outer-spin-button': { 
                                           '-webkit-appearance': 'none', 
                                            margin: 0,
                                        }
                                    }
                                }
                            }}
                        />
                        <Stack spacing={0}>
                            <IconButton size="small" onClick={() => incrementPeriod()}>
                                <ArrowUpward />
                            </IconButton>
                            <IconButton size="small" onClick={() => decrementPeriod()}>
                                <ArrowDownward />
                            </IconButton>
                        </Stack>
                        <Select
                            hiddenLabel
                            variant="filled"
                            size='small'
                            value={frequency}
                            onChange={handleChangeFrequency}
                        >
                            {CadenceFrequency.options.map((frequency: CadenceFrequency) => {
                                return (
                                    <MenuItem value={frequency} key={`${frequency}-${period}`}>
                                        {getFrequencyLabel(frequency, Number(period || 0))}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </Stack>
                    {frequency === 'MONTHLY' && (
                        <Select
                            hiddenLabel
                            fullWidth
                            variant="filled"
                            size='small'
                            value={selectedMonthlyCadenceOption}
                            onChange={(event) => setSelectedMonthlyCadenceOption(Number(event.target.value))}
                        >
                            {monthlyCadenceOptions.map((option: MonthlyCadence, index: number) => {
                                const label = getMonthlyCadenceLabel(option, dateString);

                                return (
                                    <MenuItem value={index} key={label}>
                                        {label}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    )}
                    {frequency === 'WEEKLY' && (
                        <DaysOfWeekPicker
                            value={selectedWeekDays}
                            onChange={setSelectedWeekDays}
                        />
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose()}>Cancek</Button>
                <Button variant='contained' color='primary' onClick={() => handleSubmit()}>Done</Button>
            </DialogActions>
        </Dialog>
    )
}

type RecurrenceSelectProps = Partial<Omit<SelectProps, 'children'>>

export default function RecurrenceSelect(props: RecurrenceSelectProps) {
    const [showCustomRecurrenceDialog, setShowCustomRecurrenceDialog] = useState<boolean>(true)

    const selectOptions: any[] = useMemo(() => {
        return []
    }, [])

    return (
        <>
            <CustomRecurrenceModal
                open={showCustomRecurrenceDialog}
                onClose={() => setShowCustomRecurrenceDialog(false)}
                onSubmit={() => {}}
            />
            <Select
                {...props}
            >
                <MenuItem>Does not recur</MenuItem>
                <MenuItem>Custom...</MenuItem>
            </Select>
        </>
    )
}
