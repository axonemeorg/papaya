import { Stack, Tab, Tabs } from '@mui/material'

import JournalDateActions from './JournalDateActions'
import JournalFilterPicker from './JournalFilterPicker'
import JournalEntrySelectionActions from './JournalEntrySelectionActions'

export default function JournalHeader() {
	const hideFilterButton = false	

	return (
		<>
			<Stack component='header'>
				<Stack
					direction="row"
					justifyContent="space-between"
					sx={{ flex: 0, py: 1, px: 2, pb: 0 }}
					alignItems="center"
					gap={1}
				>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent='space-between'
						sx={{ width: '100%' }}
						gap={2}
					>
						<Stack direction="row" alignItems="center" gap={1}>
							<JournalEntrySelectionActions />
							{!hideFilterButton && (
								<JournalFilterPicker />
							)}
						</Stack>
						<JournalDateActions />
					</Stack>
				</Stack>
				{/* TODO To be implemented in ZK-111 */}
				<Tabs value='JOURNAL'>
					<Tab value='JOURNAL' label='Journal Entries' />
					<Tab value='TRANSFERS' label='Account Transfers' disabled />
					<Tab value='ANALYSIS' label='Analysis' disabled />
				</Tabs>
			</Stack>
		</>
	)
}
