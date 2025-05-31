import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { JournalContext } from '@ui/contexts/JournalContext'
import { createCategory } from '@ui/database/actions'
import { getCategories } from '@ui/database/queries'
import { Category, CreateCategory } from '@ui/schema/documents/Category'
import { useContext } from 'react'

export const useCategories = () => {
  const journalContext = useContext(JournalContext)

  const activeJournalId = journalContext?.activeJournalId

  return useQuery<Record<string, Category>>({
    queryKey: [activeJournalId, 'categories'],
    queryFn: async () => {
      return getCategories(activeJournalId!)
    },
    initialData: {},
    enabled: Boolean(journalContext.activeJournalId),
  })
}

export const useAddCategory: () => (category: CreateCategory) => Promise<Category> = () => {
  const journalContext = useContext(JournalContext)

  const activeJournalId = journalContext?.activeJournalId

  const queryClient = useQueryClient()

  const { mutateAsync } = useMutation({
    mutationFn: async (category: CreateCategory) => {
      if (!activeJournalId) {
        return Promise.reject('Missing activeJournalId.')
      }
      return createCategory(category, activeJournalId)
    },
    onSuccess: (newCategory) => {
      queryClient.setQueryData([activeJournalId, 'categories'], (categories: Record<string, Category>) => {
        return {
          ...categories,
          [newCategory._id]: newCategory,
        }
      })
    },
  })

  return mutateAsync
}
