import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'

dayjs.extend(relativeTime)
dayjs.extend(utc)

export const getRelativeTime = (timestamp: string | null): string => {
	return dayjs.utc(timestamp).fromNow()
}

export const formatJournalEntryDate = (date: string | undefined): string => {
	const day = dayjs(date)
	const now = dayjs()

	// show year if older than 11 months ago
	const showYear = now.diff(day, 'month') > 11
	return day.format(showYear ? 'ddd MMM D, YYYY' : 'ddd MMM D')
}

export const getAllDatesInMonth = (inputDate: string) => {
    const [year, month] = inputDate.split('-').map(Number);

    // Get the number of days in the month
    const endDate = new Date(year, month, 0); // The last day of the previous month (0th day of next month)
    const totalDays = endDate.getDate();

    // Generate the dates in 'YYYY-MM-DD' format
    const dates: string[] = [];
    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(year, month - 1, day);
        dates.push(date.toISOString().split('T')[0]);
    }

    return dates;
}

export const sortDatesChronologically = (...dates: string[]) => {
    return dates.sort((a, b) => dayjs(a).isBefore(b) ? -1 : 1);
}
