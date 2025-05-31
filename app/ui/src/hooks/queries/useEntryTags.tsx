import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { JournalContext } from '@ui/contexts/JournalContext'
import { createEntryTag } from '@ui/database/actions'
import { getEntryTags } from '@ui/database/queries'
import { CreateEntryTag, EntryTag } from '@ui/schema/documents/EntryTag'
import { useContext } from 'react'

export const useEntryTags = () => {
  const journalContext = useContext(JournalContext)

  const activeJournalId = journalContext?.activeJournalId

  return useQuery<Record<string, EntryTag>>({
    queryKey: [activeJournalId, 'entryTags'],
    queryFn: async () => {
      return getEntryTags(activeJournalId!)
    },
    initialData: {},
    enabled: Boolean(journalContext.activeJournalId),
  })
}

export const useAddEntryTag: () => (entryTag: CreateEntryTag) => Promise<EntryTag> = () => {
  const journalContext = useContext(JournalContext)

  const activeJournalId = journalContext?.activeJournalId

  const queryClient = useQueryClient()

  const { mutateAsync } = useMutation({
    mutationFn: async (entryTag: CreateEntryTag) => {
      if (!activeJournalId) {
        return Promise.reject('Missing activeJournalId.')
      }

      return createEntryTag(entryTag, activeJournalId)
    },
    onSuccess: (newEntryTag) => {
      queryClient.setQueryData([activeJournalId, 'entryTags'], (entryTags: Record<string, EntryTag>) => {
        return {
          ...entryTags,
          [newEntryTag._id]: newEntryTag,
        }
      })
    },
  })

  return mutateAsync
}
