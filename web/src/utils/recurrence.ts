import { CadenceFrequency, DayOfWeek, MonthlyCadence, RecurringCadence, WeekNumber } from "@/types/schema";
import { getWeekOfMonth } from "./date";
import dayjs from "dayjs";
import { DAYS_OF_WEEK_NAMES } from "@/constants/date";

const FREQUENCY_LABELS: Record<CadenceFrequency, { singular: string, plural: string, adverb: string }> = {
    DAILY: { singular: 'day', plural: 'days', adverb: 'daily' },
    WEEKLY: { singular: 'week', plural: 'weeks', adverb: 'weekly' },
    MONTHLY: { singular: 'month', plural: 'months', adverb: 'monthly' },
    YEARLY: { singular: 'year', plural: 'years', adverb: 'annually' },
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
            frequency: 'MONTHLY',
            on: {
                day: dayNumber
            }
        },
    ]

    if (weekNumber <= 3) {
        cadences.push({
            frequency: 'MONTHLY',
            on: {
                week: WeekNumber.options[weekNumber - 1]
            }
        })
    } else {
        cadences.push(
            {
                frequency: 'MONTHLY',
                on: {
                    week: 'FOURTH'
                }
            },
            {
                frequency: 'MONTHLY',
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
    if (cadence.period === 1) {
        stringParts.push(FREQUENCY_LABELS[cadence.frequency].adverb)
    } else if (cadence.period > 1) {
        stringParts.push(
            'every',
            String(cadence.period),
            FREQUENCY_LABELS[cadence.frequency].plural)
    } else {
        return NON_RECURRING_LABEL
    }

    switch (cadence.frequency) {
        case CadenceFrequency.Enum.WEEKLY:
            stringParts.push(
                'on',
                sortDaysOfWeek(cadence.days)
                    .map((day: DayOfWeek) => DAYS_OF_WEEK_NAMES[day])
                    .join(', ')
            )
            break
        case CadenceFrequency.Enum.MONTHLY:
            stringParts.push(
                'on',
                getMonthlyCadenceLabel(cadence, date)
            )
            break
        case CadenceFrequency.Enum.YEARLY:
            stringParts.push(
                'on',
                dayjs(date).format('MMMM D')
            )
            break
        case CadenceFrequency.Enum.DAILY:
        default:
            break
    }

    return stringParts.join(' ');
}