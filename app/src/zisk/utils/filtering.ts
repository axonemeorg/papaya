import { AmountRange, SearchFacetKey, SearchFacets } from "@/schema/support/search/facet";
import { parseJournalEntryAmount } from "./journal";

export const enumerateFilters = (seachFacets: SearchFacets): Set<SearchFacetKey> => {
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
    const lt = parseJournalEntryAmount(amountRange.lt ?? '')
    const gt = parseJournalEntryAmount(amountRange.gt ?? '')

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
