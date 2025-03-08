import { CadenceFrequency, DayOfWeek, MonthlyCadence, RecurringCadence, WeekNumber } from "@/types/schema";
import { getWeekOfMonth } from "./date";
import dayjs from "dayjs";
import { DAYS_OF_WEEK_NAMES } from "@/constants/date";

const FREQUENCY_LABELS: Record<CadenceFrequency, { singular: string, plural: string, adverb: string }> = {
    D: { singular: 'day', plural: 'days', adverb: 'daily' },
    W: { singular: 'week', plural: 'weeks', adverb: 'weekly' },
    M: { singular: 'month', plural: 'months', adverb: 'monthly' },
    Y: { singular: 'year', plural: 'years', adverb: 'annually' },
};

export const NON_RECURRING_LABEL = 'Does not recur'

export const getFrequencyLabel = (frequency: CadenceFrequency, quantity: number ) => {
    const { singular, plural } = FREQUENCY_LABELS[frequency]

    return quantity === 1 ? singular : plural
}

export const getMonthlyRecurrencesFromDate = (date: string): MonthlyCadence[] => {
    const weekNumber = getWeekOfMonth(date)
    const dayNumber = dayjs(date).date()

    const cadences: MonthlyCadence[] = [
        {
            frequency: 'M',
            on: {
                day: dayNumber
            }
        },
    ]

    if (weekNumber <= 3) {
        cadences.push({
            frequency: 'M',
            on: {
                week: WeekNumber.options[weekNumber - 1]
            }
        })
    } else {
        cadences.push(
            {
                frequency: 'M',
                on: {
                    week: 'FOURTH'
                }
            },
            {
                frequency: 'M',
                on: {
                    week: 'LAST'
                }
            },
        )
    }

    return cadences
}

export const sortDaysOfWeek = (days: DayOfWeek[]): DayOfWeek[] => {
    return days.sort((a, b) => 
        Object.keys(DAYS_OF_WEEK_NAMES).indexOf(a) - 
        Object.keys(DAYS_OF_WEEK_NAMES).indexOf(b)
    ) as DayOfWeek[];
};

export const getMonthlyCadenceLabel = (cadence: MonthlyCadence, date: string): string => {
    let labelParts = []
    if ('day' in cadence.on) {
        labelParts.push(`day ${cadence.on.day}`)
    } else {
        labelParts.push('the')
        switch (cadence.on.week) {
            case 'FIRST':
                labelParts.push('first')
                break
            case 'SECOND':
                labelParts.push('second')
                break
            case 'THIRD':
                labelParts.push('third')
                break
            case 'FOURTH':
                labelParts.push('fourth')
                break
            case 'LAST':
                labelParts.push('last')
                break
        }
        labelParts.push(dayjs(date).format('dddd'))
    }

    return labelParts.join(' ')
}

export const getRecurringCadenceString = (cadence: RecurringCadence, date: string): string => {
    const stringParts = []
    if (cadence.interval === 1) {
        stringParts.push(FREQUENCY_LABELS[cadence.frequency].adverb)
    } else if (cadence.interval > 1) {
        stringParts.push(
            'every',
            String(cadence.interval),
            FREQUENCY_LABELS[cadence.frequency].plural)
    } else {
        return NON_RECURRING_LABEL
    }

    switch (cadence.frequency) {
        case CadenceFrequency.Enum.W:
            stringParts.push(
                'on',
                sortDaysOfWeek(cadence.days)
                    .map((day: DayOfWeek) => DAYS_OF_WEEK_NAMES[day])
                    .join(', ')
            )
            break
        case CadenceFrequency.Enum.M:
            stringParts.push(
                'on',
                getMonthlyCadenceLabel(cadence, date)
            )
            break
        case CadenceFrequency.Enum.Y:
            stringParts.push(
                'on',
                dayjs(date).format('MMMM D')
            )
            break
        case CadenceFrequency.Enum.D:
        default:
            break
    }

    return stringParts.join(' ');
}
