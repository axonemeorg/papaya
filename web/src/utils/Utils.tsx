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
