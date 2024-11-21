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

export const getPriceString = (price: number): string => {
    const isNetPositive = price > 0;
    return isNetPositive
        ? `+$${Number(price / 100).toFixed(2)}`
        : `$${Number(price / -100).toFixed(2)}`
}

const generateGenericUniqueId = () => {
    return crypto.randomUUID();
}

export const generateJournalEntryId = generateGenericUniqueId;
export const generateCategoryId = generateGenericUniqueId;

