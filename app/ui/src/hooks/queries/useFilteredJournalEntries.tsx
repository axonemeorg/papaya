import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { JournalContext } from '@ui/contexts/JournalContext'
import { JournalFilterContext, MemoryFilters } from '@ui/contexts/JournalFilterContext'
import { createJournalEntry, updateJournalEntry } from '@ui/database/actions'
import { getJournalEntriesByUpstreamFilters } from '@ui/database/queries'
import { JournalEntry } from '@ui/schema/documents/JournalEntry'
import { SearchFacets } from '@ui/schema/support/search/facet'
import { FacetedSearchUpstreamFilters } from '@ui/schema/support/search/filter'
import { enumerateFilters, getJournalEntriesByDownstreamFilters } from '@ui/utils/filtering'
import { useContext } from 'react'

export const useFilteredJournalEntries = () => {
  const journalContext = useContext(JournalContext)
  const journalFilterContext = useContext(JournalFilterContext)

  const activeJournalId = journalContext?.activeJournalId
  const activeJournalFilters: Partial<SearchFacets> = journalFilterContext?.activeJournalFilters ?? {}
  const activeJournalMemoryFilters: Partial<MemoryFilters> = journalFilterContext?.activeJournalMemoryFilters ?? {}

  return useQuery<Record<string, JournalEntry>>({
    queryKey: [activeJournalId, 'journalEntries', activeJournalFilters],
    queryFn: async () => {
      const downstreamFacets = Object.fromEntries(
        enumerateFilters(activeJournalMemoryFilters as Partial<SearchFacets>, true).filter(
          ([key]) => !FacetedSearchUpstreamFilters[key],
        ),
      ) as Partial<SearchFacets>
      console.log('downstreamFacets:', downstreamFacets)

      const entries: JournalEntry[] = await getJournalEntriesByUpstreamFilters(activeJournalId!, activeJournalFilters)

      console.log('before:', entries)
      const filteredEntries = await getJournalEntriesByDownstreamFilters(entries, downstreamFacets)
      console.log('after:', filteredEntries)
      return Object.fromEntries(filteredEntries.map((entry: JournalEntry) => [entry._id, entry]))
    },
    initialData: {},
    enabled: Boolean(journalContext.activeJournalId),
  })
}

export const useAddJournalEntry: () => (entry: JournalEntry) => Promise<JournalEntry> = () => {
  const journalContext = useContext(JournalContext)
  const journalFilterContext = useContext(JournalFilterContext)

  const activeJournalId = journalContext?.activeJournalId
  const activeJournalFilters: Partial<SearchFacets> = journalFilterContext?.activeJournalFilters ?? {}

  const queryClient = useQueryClient()

  const { mutateAsync } = useMutation({
    mutationFn: async (entry: JournalEntry) => {
      if (!activeJournalId) {
        return Promise.reject('Missing activeJournalId.')
      }
      return createJournalEntry(entry, activeJournalId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [activeJournalId, 'journalEntries'],
        exact: false,
      })
    },
  })

  return mutateAsync
}
export const useUpdateJournalEntry: () => (entry: JournalEntry) => Promise<JournalEntry> = () => {
  const journalContext = useContext(JournalContext)
  const journalFilterContext = useContext(JournalFilterContext)

  const activeJournalId = journalContext?.activeJournalId
  const activeJournalFilters: Partial<SearchFacets> = journalFilterContext?.activeJournalFilters ?? {}

  const queryClient = useQueryClient()

  const { mutateAsync } = useMutation({
    mutationFn: async (entry: JournalEntry): Promise<JournalEntry> => {
      if (!activeJournalId) {
        return Promise.reject('Missing activeJournalId.')
      }
      return updateJournalEntry(entry)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [activeJournalId, 'journalEntries'],
        exact: false,
      })
    },
  })

  return mutateAsync
}
