import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createJournal } from '@ui/database/actions'
import { getJournals } from '@ui/database/queries'
import { CreateJournal, Journal } from '@ui/schema/documents/Journal'

export const useJournals = () => {
  return useQuery<Record<string, Journal>>({
    queryKey: ['journals'],
    queryFn: async () => {
      return getJournals()
    },
    initialData: {},
    enabled: true,
  })
}

export const useAddJournal: () => (journal: CreateJournal) => Promise<Journal> = () => {
  const queryClient = useQueryClient()

  const { mutateAsync } = useMutation({
    mutationFn: async (journal: CreateJournal) => {
      return createJournal(journal)
    },
    onSuccess: (newJournal) => {
      queryClient.setQueryData(['journals'], (journals: Record<string, Journal>) => {
        return {
          ...journals,
          [newJournal._id]: newJournal,
        }
      })
    },
  })

  return mutateAsync
}
