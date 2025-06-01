import { SearchFacetGroups, SearchFacets } from '@/schema/support/search/facet'
import { createContext } from 'react'
import z from 'zod'

export type RouterFilters = z.infer<typeof SearchFacetGroups.router>

export type MemoryFilters = z.infer<typeof SearchFacetGroups.memory>

export interface JournalFilterContext {
  activeJournalFilters: Partial<SearchFacets>
  activeJournalMemoryFilters: Partial<MemoryFilters>
  updateJournalMemoryFilters: (predicate: (prev: Partial<MemoryFilters>) => Partial<MemoryFilters>) => void
}

export const JournalFilterContext = createContext<JournalFilterContext | null>(null)
