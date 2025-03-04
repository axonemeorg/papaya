import { getFrequencyLabel, getMonthlyCadenceLabel, getMonthlyRecurrencesFromDate } from "@/utils/recurrence"
import { CadenceFrequency, DayOfWeek, MonthlyCadence, RecurringCadence } from "@/types/schema"
import { ArrowDownward, ArrowUpward } from "@mui/icons-material"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, SelectChangeEvent, SelectProps, Stack, TextField, Typography } from "@mui/material"
import { ChangeEvent, useEffect, useMemo, useState } from "react"
import DaysOfWeekPicker from "../pickers/DaysOfWeekPicker"
import dayjs from "dayjs"

interface CustomRecurrenceModalProps {
    open: boolean
    date: string
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
        let response: RecurringCadence
        switch (frequency) {
            case 'YEARLY':
                response = {
                    frequency: 'YEARLY',
                    period: Number(period),
                }
                break
            case 'DAILY':
                response = {
                    frequency: 'DAILY',
                    period: Number(period),
                }
                break
            case 'WEEKLY': {
                response = {
                    frequency: 'WEEKLY',
                    period: Number(period),
                    days: Array.from(selectedWeekDays),
                }
                break
            }
            case 'MONTHLY':
            default:
                response = {
                    ...monthlyCadenceOptions[selectedMonthlyCadenceOption],
                    period: Number(period),
                }
                break
        }
        onSubmit(response)
    }

    useEffect(() => {
        setSelectedMonthlyCadenceOption(0)
        setMonthlyCadenceOptions(getMonthlyRecurrencesFromDate(props.date))
        setSelectedWeekDays(new Set<DayOfWeek>([dayjs(props.date).format('ddd').toUpperCase() as DayOfWeek]))
    }, [props.date])

    return (
        <Dialog {...rest} maxWidth='xs' fullWidth>
            <DialogTitle>Custom recurrence</DialogTitle>
            <DialogContent>
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
                                const label = getMonthlyCadenceLabel(option, props.date);

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
                <Button onClick={() => props.onClose()}>Cancel</Button>
                <Button variant='contained' color='primary' onClick={() => handleSubmit()}>Done</Button>
            </DialogActions>
        </Dialog>
    )
}

interface RecurrenceSelectProps extends Partial<Omit<SelectProps<RecurringCadence | undefined>, 'children'>> {
    date: string
}

export default function RecurrenceSelect(props: RecurrenceSelectProps) {
    const [showCustomRecurrenceDialog, setShowCustomRecurrenceDialog] = useState<boolean>(true)

    const selectOptions: (RecurringCadence | string)[] = useMemo(() => {
        const options = []
        if (props.value) {
            options.push(props.value)
        }
        return options
    }, [props.date, props.value])

    const handleChange = (event: SelectChangeEvent<RecurringCadence | string>) => {
        const { value } = event.target
        if (value === 'CUSTOM') {
            setShowCustomRecurrenceDialog(true)
            event.preventDefault()
            return
        }
        if (props.onChange) {
            props.onChange(event)
        }
    }

    const handleSubmitCustomRecurrenceForm = (value: RecurringCadence) => {
        console.log('handleSubmitCustomRecurrenceForm value:', value)
        handleChange({ target: { value, name: props.name } } as SelectChangeEvent<RecurringCadence>);
        setShowCustomRecurrenceDialog(false)
    }

    return ( 
        <>
            <CustomRecurrenceModal
                open={showCustomRecurrenceDialog}
                date={props.date}
                onClose={() => setShowCustomRecurrenceDialog(false)}
                onSubmit={handleSubmitCustomRecurrenceForm}
            />
            <Select
                {...props}
                onChange={handleChange}
            >
                <MenuItem value='NON_RECURRING'>Does not recur</MenuItem>
                {selectOptions.map((option) => {
                    return (
                        <MenuItem key={JSON.stringify(option)}>
                            
                        </MenuItem>
                    )
                })}
                <MenuItem value='CUSTOM'>Custom...</MenuItem>
            </Select>
        </>
    )
}
