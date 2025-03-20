import ManageAccounts from '@/components/journal/accounts/ManageAccounts'
import { Container } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

const AccountsPage = () => {
	return (
		<Container maxWidth="xl" disableGutters sx={{ pt: 1, pl: 1, pr: 3 }}>
			<ManageAccounts />
		</Container>
	)
}

export const Route = createFileRoute('/_mainLayout/accounts')({
	component: AccountsPage,
})

