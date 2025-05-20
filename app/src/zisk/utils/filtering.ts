import { AmountRange, SearchFacetKey, SearchFacets } from "@/schema/support/search/facet";
import { parseJournalEntryAmount } from "./journal";
import { JournalEntry } from "@/schema/documents/JournalEntry";
import { FacetedSearchDownstreamFilters } from "@/schema/support/search/filter";

export const enumerateFilters = (searchFacets: Partial<SearchFacets>): Set<SearchFacetKey> => {
    const {
        AMOUNT,
        CATEGORIES,
    } = searchFacets
    const slots: Set<SearchFacetKey> = new Set<SearchFacetKey>([])
    if (CATEGORIES && CATEGORIES.categoryIds.length > 0) {
        slots.add(SearchFacetKey.CATEGORIES)
    }
    if (AMOUNT) {
        if (parseJournalEntryAmount(AMOUNT?.gt ?? '') !== undefined || parseJournalEntryAmount(AMOUNT?.lt ?? '') !== undefined) {
            slots.add(SearchFacetKey.AMOUNT)
        }
    }

    return slots
}

export const enumerateFilterPairs = (searchFacets: Partial<SearchFacets>): Array<[SearchFacetKey, any]> => {
    const {
        AMOUNT,
        CATEGORIES,
    } = searchFacets
    const result: Array<[SearchFacetKey, any]> = []
    
    if (CATEGORIES && CATEGORIES.categoryIds.length > 0) {
        result.push([SearchFacetKey.CATEGORIES, CATEGORIES])
    }
    if (AMOUNT) {
        if (parseJournalEntryAmount(AMOUNT?.gt ?? '') !== undefined || parseJournalEntryAmount(AMOUNT?.lt ?? '') !== undefined) {
            result.push([SearchFacetKey.AMOUNT, AMOUNT])
        }
    }

    return result
}

export const transformAmountRange = (amountRange: AmountRange): { greaterThan: number | undefined, lessThan: number | undefined } => {
    const lt: number | undefined = parseJournalEntryAmount(amountRange.lt ?? '')?.amount
    const gt: number | undefined = parseJournalEntryAmount(amountRange.gt ?? '')?.amount

    const greaterThan: number[] = []
    const lessThan: number[] = []

    if (gt !== undefined) {
        if (gt <= 0) {
            // "More than $X" where X is an expense
            lessThan.push(gt)
        } else {
            // "More than $X" where X is an income
            greaterThan.push(gt)
        }
    }
    if (lt !== undefined) {
        if (lt <= 0) {
            // "Less than $X" where X is an expense
            greaterThan.push(lt)
            lessThan.push(0)
        } else {
            // "Less than $X" where X is an income
            lessThan.push(lt)
            if (!greaterThan.length) {
                greaterThan.push(0)
            }
        }
    }

    return {
        greaterThan: greaterThan.length > 0 ? Math.max(...greaterThan) : undefined,
        lessThan: lessThan.length > 0 ? Math.min(...lessThan) : undefined,
    }
}

export const getJournalEntriesByDownstreamFilters = async (
    journalEntries: JournalEntry[],
    downstreamFilters: Partial<SearchFacets>
): Promise<JournalEntry[]> => {
    return Promise.resolve(
        Object.entries(FacetedSearchDownstreamFilters)
            .reduce((acc: JournalEntry[], [key, downstreamQueryFilter]) => {
                if (!downstreamQueryFilter) {
                    return acc
                }
                const facetKey = key as keyof SearchFacets;
                const filterValue = downstreamFilters[facetKey];
                if (filterValue === undefined) {
                    return acc;
                }
                const result = downstreamQueryFilter(filterValue as any, acc)
                return result ?? acc
            }, journalEntries)
        )
}
