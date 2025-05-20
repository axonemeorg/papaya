import { AmountRange, SearchFacetKey, SearchFacets } from "@/schema/support/search/facet";
import { parseJournalEntryAmount } from "./journal";
import { JournalEntry } from "@/schema/documents/JournalEntry";
import { FacetedSearchDownstreamFilters } from "@/schema/support/search/filter";

export const enumerateFilters = (seachFacets: Partial<SearchFacets>): Set<SearchFacetKey> => {
    const {
        AMOUNT,
        CATEGORIES,
    } = seachFacets
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

export const getJournaEntriesByDownstreamFilters = async (
    journalEntries: JournalEntry[],
    downstreamFilters: Partial<SearchFacets>
): Promise<JournalEntry[]> => {
    return Promise.resolve(
        Object.entries(FacetedSearchDownstreamFilters)
            .reduce((acc: JournalEntry[], [key, downstreamQueryFilter]) => {
                if (!downstreamQueryFilter) {
                    return acc
                }
                const result = downstreamQueryFilter(downstreamFilters[key], acc)
                return result ?? acc
            }, journalEntries)
        )
}
