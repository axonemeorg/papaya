import z from "zod";
import { Currency } from "../currency";

export const AnnualPeriod = z.object({
  year: z.number().min(1900).max(2999)
})

export type AnnualPeriod = z.output<typeof AnnualPeriod>


export const MonthlyPeriod = AnnualPeriod.extend({
  month: z.number().min(1).max(12)
})

export type MonthlyPeriod = z.output<typeof MonthlyPeriod>

export const WeeklyPeriod = MonthlyPeriod.extend({
  day: z.number().min(1).max(31)
})

export type WeeklyPeriod = z.output<typeof WeeklyPeriod>

export const DatePeriod = z.union([AnnualPeriod, MonthlyPeriod, WeeklyPeriod])

export type DatePeriod = z.output<typeof DatePeriod>

export const DateRange = z.object({
  before: z.string().optional(),
  after: z.string().optional(),
})

export type DateRange = z.output<typeof DateRange>

export const DateView = z.union([DatePeriod, DateRange])

export type DateView = z.output<typeof DateView>

export enum DateViewSymbol {
  WEEKLY = 'w',
  MONTHLY = 'm',
  YEARLY = 'y',
  RANGE = 'r',
}

export const AmountRange = z.object({
  currency: Currency,
  gt: z.string().optional(),
  lt: z.string().optional(),
  absolute: z.boolean().optional(),
})

export type AmountRange = z.output<typeof AmountRange>


export enum SearchFacetKey {
  'AMOUNT' = 'AMOUNT',
  'ATTACHMENTS' = 'ATTACHMENTS',
  'CATEGORIES' = 'CATEGORIES',
  'DATE' = 'DATE',
  'TAGS' = 'TAGS',
}

export const SearchFacetGroups = {
  router: z.object({
    [SearchFacetKey.DATE]: DateView,
  }),
  memory: z.object({
    [SearchFacetKey.TAGS]: z.object({
      tagIds: z.array(z.string())
    }),
    [SearchFacetKey.CATEGORIES]: z.object({
      categoryIds: z.array(z.string())
    }),
    [SearchFacetKey.AMOUNT]: AmountRange,
    [SearchFacetKey.ATTACHMENTS]: z.object({
      hasAttachments: z.boolean()
    })
  }) 
} as const

export const SearchFacets = z.object({
  ...SearchFacetGroups.memory.shape,
  ...SearchFacetGroups.router.shape,
})

export type SearchFacets = z.infer<typeof SearchFacets>
