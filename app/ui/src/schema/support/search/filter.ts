import { JournalEntry } from '@ui/schema/documents/JournalEntry'
import { getAbsoluteDateRangeFromDateView } from '@ui/utils/date'
import { transformAmountRange } from '@ui/utils/filtering'
import dayjs from 'dayjs'
import { AmountRange, DateView, SearchFacets } from './facet'

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
              },
            },
          },
        },
      },
    ]
  },

  CATEGORIES: null,

  DATE: (filter: DateView) => {
    const { startDate, endDate } = getAbsoluteDateRangeFromDateView(filter)

    if (!startDate && !endDate) {
      return null
    }

    return [
      {
        date: {
          $gte: startDate?.format('YYYY-MM-DD'),
          $lte: endDate?.format('YYYY-MM-DD'),
        },
      },
    ]
  },

  TAGS: (filter) => {
    const tagIds = filter.tagIds
    const statusIds = filter.statusIds || []
    const allIds = [...tagIds, ...statusIds]

    if (!allIds.length) {
      return null
    }

    const conditions = []

    if (tagIds.length > 0) {
      conditions.push({
        tagIds: {
          $in: tagIds,
        },
      })
    }

    if (statusIds.length > 0) {
      conditions.push({
        statusIds: {
          $in: statusIds,
        },
      })
    }

    return conditions
  },
}

export const FacetedSearchDownstreamFilters: { [K in keyof SearchFacets]: DownstreamQueryFilter<SearchFacets[K]> } = {
  AMOUNT: (filter: AmountRange, entries: JournalEntry[]) => {
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

  CATEGORIES: (filter, entries) => {
    const categoryIds = new Set(filter.categoryIds)
    return entries.filter((entry) => {
      return entry.categoryId && categoryIds.has(entry.categoryId)
    })
  },

  DATE: (filter, entries) => {
    const { startDate, endDate } = getAbsoluteDateRangeFromDateView(filter)

    if (!startDate && !endDate) {
      return null
    }

    return entries.filter((entry) => {
      const date = dayjs(entry.date)
      return !date.isBefore(startDate) && !date.isAfter(endDate)
    })
  },

  TAGS: (filter, entries) => {
    const tagIds = new Set(filter.tagIds)
    const statusIds = new Set(filter.statusIds || [])

    if (!tagIds.size && !statusIds.size) {
      return null
    }

    return entries.filter((entry) => {
      // Check for tag matches if we have tag filters
      if (tagIds.size > 0) {
        if (!entry.tagIds || entry.tagIds.length === 0) {
          return false
        }

        // Check if any of the entry's tags are in the filter's tagIds
        const hasMatchingTag = entry.tagIds.some((tagId) => tagIds.has(tagId))
        if (hasMatchingTag) {
          return true
        }
      }

      // Check for status matches if we have status filters
      if (statusIds.size > 0) {
        if (!entry.statusIds || entry.statusIds.length === 0) {
          return false
        }

        // Check if any of the entry's statuses are in the filter's statusIds
        return entry.statusIds.some((statusId) => statusIds.has(statusId))
      }

      // If we have tag filters but no matches, and no status filters matched either
      return false
    })
  },
}
