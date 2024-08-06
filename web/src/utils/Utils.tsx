import { JournalDate } from "@/types/calendar";
import dayjs from "dayjs";

/**
 * Formats a URL for printing, which strips most of the URL away, excluding
 * the hostname and TLD.
 */
export const prettyPrintUrl = (url: string | undefined): string => {
    if (!url) {
        return '';
    }

    try {
        const urlObject = new URL(url);
        const hostname = urlObject.hostname;
        if (hostname.startsWith('www.')) {
            return hostname.slice(4)
        }

        return hostname
    } catch (error) {
        console.error('Invalid URL:', error);
        return '';
    }
}

export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function (...args: Parameters<T>) {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, wait);
    };
}

export const getTodayYearAndMonth = () => {
    const now = dayjs();
    const year = Number(now.format('YYYY'));
    const month = Number(now.format('M'));

    return { year, month };
}

export const getPreviousYearMonth = ({ year, month }: JournalDate) => {
    return {
        year: (month === 1 ? year - 1 : year),
        month: month === 1 ? 12 : month - 1
    }
}

export const getNextYearMonth = ({ year, month }: JournalDate) => {
    return {
        year: (month === 12 ? year + 1 : year),
        month: month === 12 ? 1 : month + 1
    }
}

export const getJournalDateUrl = ({ year, month }: JournalDate): string => {
    const urlParts = [
        '',
        'journal',
        year,
        month,
    ];

    return urlParts.join('/');
}
