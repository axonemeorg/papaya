import { BasicAnalytics, Category, DateView, JournalEntry } from "@/types/schema"
import { getAbsoluteDateRangeFromDateView } from "./date"
import dayjs from "dayjs"
import { calculateNetAmount } from "./journal"

export const calculateBasicAnalytics = (journalEntries: JournalEntry[], dateView: DateView): BasicAnalytics => {
    if (!journalEntries.length) {
        return { chart: { data: [], labels: [] }, sumGain: 0, sumLoss: 0 }
    }
    const { startDate, endDate } = getAbsoluteDateRangeFromDateView(dateView)
    let sumGain: number = 0
    let sumLoss: number = 0
    const dateSums: Record<string, number> = {}

    journalEntries.forEach((entry) => {
        const netAmount = calculateNetAmount(entry)
        if (netAmount > 0) {
            sumGain += netAmount
        } else {
            sumLoss += Math.abs(netAmount)
        }
        const { date } = entry
        if (date) {
            if (dateSums[date] === undefined) {
                dateSums[date] = 0
            }
            dateSums[date] += netAmount
        }
    })

    const data: number[] = []
    const labels: string[] = []
    if (startDate && endDate) {
        let runningSum = 0
        for (let d = dayjs(startDate); d.isBefore(endDate) || d.isSame(endDate); d = d.add(1, 'day')) {
            const date = d.format('YYYY-MM-DD')
            const dateSum = dateSums[date] ?? 0
            runningSum += dateSum
            data.push(runningSum)
            labels.push(date)
        }
    }
    return { sumLoss, sumGain, chart: { data, labels } }
}


export const calculateCategorySums = (journalEntries: JournalEntry[]): Record<string, number> => {
    return journalEntries.reduce((acc: Record<Category['_id'], number>, entry: JournalEntry) => {
        if (entry.categoryId) {

        }

        return acc
    }, {})
}
