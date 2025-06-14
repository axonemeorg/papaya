import ManageAccounts from '@/components/journal/accounts/ManageAccounts'
import { createFileRoute } from '@tanstack/react-router'

const AccountsPage = () => {
  return <ManageAccounts />
}

export const Route = createFileRoute('/_mainLayout/accounts')({
  component: AccountsPage,
})
