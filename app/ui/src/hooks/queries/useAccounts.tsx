import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { JournalContext } from '@ui/contexts/JournalContext'
import { createAccount } from '@ui/database/actions'
import { getAccounts } from '@ui/database/queries'
import { Account, CreateAccount } from '@ui/schema/documents/Account'
import { useContext } from 'react'

export const useAccounts = () => {
  const journalContext = useContext(JournalContext)

  const activeJournalId = journalContext?.activeJournalId

  return useQuery<Record<string, Account>>({
    queryKey: [activeJournalId, 'accounts'],
    queryFn: async () => {
      let response: Record<string, Account>
      return getAccounts(activeJournalId!)
    },
    initialData: {},
    enabled: Boolean(journalContext.activeJournalId),
  })
}

export const useAddAccount: () => (account: CreateAccount) => Promise<Account> = () => {
  const journalContext = useContext(JournalContext)

  const activeJournalId = journalContext?.activeJournalId

  const queryClient = useQueryClient()

  const { mutateAsync } = useMutation({
    mutationFn: async (account: CreateAccount) => {
      if (!activeJournalId) {
        return Promise.reject('Missing activeJournalId.')
      }
      return createAccount(account, activeJournalId)
    },
    onSuccess: (newAccount) => {
      queryClient.setQueryData([activeJournalId, 'accounts'], (accounts: Record<string, Account>) => {
        return {
          ...accounts,
          [newAccount._id]: newAccount,
        }
      })
    },
  })

  return mutateAsync
}
