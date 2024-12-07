import { JournalAllFilters } from "@/components/journal/JournalFilters";

type JournalFilterKeys = keyof JournalAllFilters; // Get the keys of JournalAllFilters

type JournalFilterShorthandKeyMap = {
    [K in `${JournalFilterKeys}:`]: string;
};

export const JOURNAL_FILTER_SHORTHAND_KEY_MAP: JournalFilterShorthandKeyMap = {
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
) as Record<string, keyof JournalFilterShorthandKeyMap>;
