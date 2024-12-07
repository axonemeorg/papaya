import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'

dayjs.extend(relativeTime)
dayjs.extend(utc)

export const getRelativeTime = (timestamp: string | null): string => {
	return dayjs.utc(timestamp).fromNow()
}
