import { JournalContext } from "@/contexts/JournalContext"
import { JournalFilterContext } from "@/contexts/JournalFilterContext"
import { createJournalEntry, updateJournalEntry } from "@/database/actions"
import { getJournalEntriesByUpstreamFilters } from "@/database/queries"
import { JournalEntry } from "@/schema/documents/JournalEntry"
import { SearchFacets } from "@/schema/support/search/facet"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useContext } from "react"

export const useFilteredJournalEntries = () => {

  const journalContext = useContext(JournalContext)
  const journalFilterContext = useContext(JournalFilterContext)

  const activeJournalId = journalContext?.activeJournalId
  const activeJournalFilters: Partial<SearchFacets> = journalFilterContext?.activeJournalFilters ?? {}

  return useQuery<Record<string, JournalEntry>>({
		queryKey: [activeJournalId, 'journalEntries', activeJournalFilters],
		queryFn: async () => {
      console.log('useFilteredJournalEntries.queryFn() - executing with filters:', activeJournalFilters)

			const response = await getJournalEntriesByUpstreamFilters(
          activeJournalId!,
          activeJournalFilters,
      )

      return response;
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
        exact: false
      });
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
        exact: false
      });
    },
  })

  return mutateAsync
}
