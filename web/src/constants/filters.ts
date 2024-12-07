import { JournalAllFilters } from "@/components/journal/JournalFilters";

type JournalFilterKeys = keyof JournalAllFilters; // Get the keys of JournalAllFilters

type JournalFilterKeyMap = {
    [K in `${JournalFilterKeys}:`]: string;
};

export const JOURNAL_FILTER_SHORTHAND_KEY_MAP: JournalFilterKeyMap = {
    'categories:': 'cs',
    'entryType:': 'et',
    'entryTags:': 'ts',
    'hasAttachments:': 'at',
    'dateBefore:': 'db',
    'dateAfter:': 'da',
    'transactionAmountRange:': 'a',
};

export const JOURNAL_FILTER_SHORTHAND_KEY_MAP_INVERSE = Object.fromEntries(
    Object.entries(JOURNAL_FILTER_SHORTHAND_KEY_MAP).map(([key, value]) => [value, key])
) as Record<string, keyof JournalFilterKeyMap>;

export const JOURNAL_FILTER_KEY_SERIALIZER = {
    'categories:': (value: string[]) => value.join(','),
    'entryType:': (value: string) => value,
    'entryTags:': (value: string[]) => value.join(','),
    'hasAttachments:': (value: boolean) => (value ? 'true' : 'false'),
    'dateBefore:': (value: string) => value,
    'dateAfter:': (value: string) => value,
    'transactionAmountRange:': (value: [number, number]) => value.join(','),
};

