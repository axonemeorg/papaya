import {
	Paper,
	Stack,
	Typography,
	Tabs,
	Tab,
} from '@mui/material'
import Link from 'next/link'
import { useMemo } from 'react'
import AccountSettings from './AccountSettings'
import { useRouter } from 'next/router'

const SETTINGS_TABS = {
	'appearance': {
		label: 'Appearance & Behavior',
	},
	'account': {
		label: 'Account',
	},
	'journals': {
		label: 'Journals'
	}
}

const DEFAULT_TAB = Object.keys(SETTINGS_TABS)[0]

export default function ManageSettings() {
	const router = useRouter()
	const tab = (router.query['settings-slug'] as string) ?? DEFAULT_TAB

	const tabIndex = useMemo(() => {
		return Object.keys(SETTINGS_TABS).indexOf(tab)
	}, [tab])

	return (
		<>
			<Stack mb={4} gap={0.5}>
				<Typography variant='h4'>Settings</Typography>
				<Tabs value={tabIndex}>
					{Object.entries(SETTINGS_TABS).map(([key, tab]) => {
						const href = `/settings/${key}`
						return (
							<Tab
								component={Link}
								href={href}
								key={key}
								label={tab.label}
								sx={{
									// px: 0.5,
								}}
							/>
						)
					})}
				</Tabs>
			</Stack>

			<Paper sx={(theme) => ({ p: 2, borderRadius: theme.spacing(1) })}>
				{tab === 'account' && (
					<AccountSettings />
				)}
			</Paper>
		</>
	)
}
