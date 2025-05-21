import { AmountRange, DateView, SearchFacetKey, SearchFacets } from "./facet";
import { JournalEntry } from "@/schema/documents/JournalEntry";
import { getAbsoluteDateRangeFromDateView } from "@/utils/date";
import { transformAmountRange } from "@/utils/filtering";
import dayjs from "dayjs";

export type DownstreamQueryFilter<T = unknown> = null | ((filter: T, entries: JournalEntry[]) => null | JournalEntry[])

export type UpstreamQueryFilter<T = unknown> = null | ((filter: T) => null | Record<string, unknown>[])

export const FacetedSearchUpstreamFilters: { [K in keyof SearchFacets]: UpstreamQueryFilter<SearchFacets[K]> } = {
  AMOUNT: (filter: AmountRange) => {
    const { greaterThan, lessThan } = transformAmountRange(filter)

      return [
          {
              $derived: {
                  net: {
                    [filter.currency]: {
                      currency: filter.currency,
                      amount: {
                          $gt: greaterThan,
                          $lt: lessThan,
                      }
                    },
                  },
              }
          },
      ]
  },

  'CATEGORIES': null,

  'DATE': (filter: DateView) => {
    const { startDate, endDate } = getAbsoluteDateRangeFromDateView(filter)

    if (!startDate && !endDate) {
        return null
    }

    return [
        {
            date: {
                $gte: startDate?.format('YYYY-MM-DD'),
                $lte: endDate?.format('YYYY-MM-DD'),
            }
        }
    ]
  },

  'TAGS': (filter) => {
    const tagIds = filter.tagIds

    if (!tagIds || tagIds.length === 0) {
        return null
    }

    return [
        {
            tagIds: {
                $in: tagIds
            }
        }
    ]
  },
}

export const FacetedSearchDownstreamFilters: { [K in keyof SearchFacets]: DownstreamQueryFilter<SearchFacets[K]> } = {
  'AMOUNT': (filter: AmountRange, entries: JournalEntry[]) => {
    const { greaterThan, lessThan } = transformAmountRange(filter)

    if (greaterThan === undefined && lessThan === undefined) {
        return null
    }

    return entries.filter((entry) => {
        const amount = entry.$derived?.net?.[filter.currency]?.amount
        if (amount === undefined) {
            return false
        } else if (greaterThan !== undefined && amount <= greaterThan) {
            return false
        } else if (lessThan !== undefined && amount >= lessThan) {
            return false
        }
        return true
    })
  },

  'CATEGORIES': (filter, entries) => {
    const categoryIds = new Set(filter.categoryIds)
    return entries.filter((entry) => {
        return entry.categoryId && categoryIds.has(entry.categoryId)
    })
  },

  'DATE': (filter, entries) => {
    const { startDate, endDate } = getAbsoluteDateRangeFromDateView(filter)

    if (!startDate && !endDate) {
        return null
    }

    return entries.filter((entry) => {
        const date = dayjs(entry.date)
        return !date.isBefore(startDate) && !date.isAfter(endDate)
    })
  },

  'TAGS': (filter, entries) => {
    const tagIds = new Set(filter.tagIds)
    
    if (!tagIds.size) {
        return null
    }
    
    return entries.filter((entry) => {
        if (!entry.tagIds || entry.tagIds.length === 0) {
            return false
        }
        
        // Check if any of the entry's tags are in the filter's tagIds
        return entry.tagIds.some(tagId => tagIds.has(tagId))
    })
  },
}
