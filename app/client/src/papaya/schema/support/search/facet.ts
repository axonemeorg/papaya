import z from 'zod'
import { Currency } from '../currency'

export enum DateViewVariant {
  ANNUAL = 'y',
  MONTHLY = 'm',
  WEEKLY = 'w',
  DAILY = 'd',
  FISCAL = 'f',
  CUSTOM = 'r',
}

export const DailyDateView = z.object({
  view: z.literal(DateViewVariant.DAILY),
  year: z.number().min(1900).max(2999),
  month: z.number().min(1).max(12),
  day: z.number().min(1).max(31),
})
export type DailyDateView = z.output<typeof DailyDateView>

export const WeeklyDateView = DailyDateView.extend({
  view: z.literal(DateViewVariant.WEEKLY),
})
export type WeeklyDateView = z.output<typeof WeeklyDateView>

export const FiscalDateView = DailyDateView.extend({
  view: z.literal(DateViewVariant.FISCAL),
})
export type FiscalDateView = z.output<typeof FiscalDateView>

export const AnnualDateView = DailyDateView.partial().extend({
  view: z.literal(DateViewVariant.ANNUAL),
  year: DailyDateView.shape.year,
})
export type AnnualDateView = z.output<typeof AnnualDateView>

export const MonthlyDateView = AnnualDateView.extend({
  view: z.literal(DateViewVariant.MONTHLY),
  month: DailyDateView.shape.month,
})
export type MonthlyDateView = z.output<typeof MonthlyDateView>

export const CustomDateView = z.object({
  view: z.literal(DateViewVariant.CUSTOM),
  before: z.string().optional(),
  after: z.string().optional(),
})
export type CustomDateView = z.output<typeof CustomDateView>

export const DateView = z.discriminatedUnion('view', [
  AnnualDateView,
  MonthlyDateView,
  WeeklyDateView,
  DailyDateView,
  FiscalDateView,
  CustomDateView,
])
export type DateView = z.output<typeof DateView>

export const AmountRange = z.object({
  currency: Currency,
  gt: z.string().optional(),
  lt: z.string().optional(),
  absolute: z.boolean().optional(),
})
export type AmountRange = z.output<typeof AmountRange>

export enum SearchFacetKey {
  'AMOUNT' = 'AMOUNT',
  // 'ATTACHMENTS' = 'ATTACHMENTS',
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
      tagIds: z.array(z.string()),
      statusIds: z.array(z.string()).optional(),
    }),
    [SearchFacetKey.CATEGORIES]: z.object({
      categoryIds: z.array(z.string()),
    }),
    [SearchFacetKey.AMOUNT]: AmountRange,
    // [SearchFacetKey.ATTACHMENTS]: z.object({
    //   hasAttachments: z.boolean()
    // })
  }),
} as const

export const SearchFacets = z.object({
  ...SearchFacetGroups.memory.shape,
  ...SearchFacetGroups.router.shape,
})

export type SearchFacets = z.infer<typeof SearchFacets>
