import {
	Paper,
	Stack,
	Typography,
	Tabs,
	Tab,
} from '@mui/material'
import JournalSettings from './JournalSettings'
import SyncingSettings from './SyncingSettings'
import { Link, useRouter } from '@tanstack/react-router'
import { useParams } from '@tanstack/react-router';

export const SETTINGS_TABS = {
	syncing: {
	  label: "Syncing & Account",
	  component: <SyncingSettings />,
	},
	appearance: {
	  label: "Appearance & Behavior",
	  component: <Typography>Appearance Settings</Typography>,
	},
	journal: {
	  label: "Journal",
	  component: <JournalSettings />,
	},
};

const DEFAULT_TAB = Object.keys(SETTINGS_TABS)[0]

export default function ManageSettings() {
	const router = useRouter();

	const section = useParams({ strict: false }).section ?? ''

	const tabKeys = Object.keys(SETTINGS_TABS);
	const tabIndex = tabKeys.indexOf(section);

	return (
		<>
			<Stack mb={4} gap={0.5}>
				<Typography variant='h4'>Settings</Typography>
				<Tabs value={tabIndex} sx={{ mx: -1 }}>
					{Object.entries(SETTINGS_TABS).map(([key, tab]) => {
						return (
							<Tab
								component={Link}
								to={{ pathname: "/settings/$section", params: { section: key } } as unknown as string}
								key={key}
								label={tab.label}
								sx={{
									px: 1,
								}}
							/>
						)
					})}
				</Tabs>
			</Stack>

			<Paper sx={(theme) => ({ p: 3, borderRadius: theme.spacing(1), mb: 5 })}>
				{SETTINGS_TABS[section]?.component}
			</Paper>
		</>
	)
}
