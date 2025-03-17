import { Badge, Button, Fade, IconButton, Stack, Tab, Tabs, Tooltip, Typography } from '@mui/material'

import JournalDateActions from './JournalDateActions'
import JournalFilterPicker from './JournalFilterPicker'
import JournalEntrySelectionActions from './JournalEntrySelectionActions'
import JournalFilterRibbon from './JournalFilterRibbon'
import { useContext, useRef, useState } from 'react'
import { Add, FilterAltOff } from '@mui/icons-material'
import { JournalSliceContext } from '@/contexts/JournalSliceContext'

export default function JournalHeader() {
	const [showFiltersMenu, setShowFiltersMenu] = useState<boolean>(false)
    const filtersMenuButtonRef = useRef<HTMLButtonElement | null>(null)

	const journalSliceContext = useContext(JournalSliceContext)
    const numFilters = journalSliceContext.getSliceFilterCount()

	const hideFilterButton = false

	return (
		<>
			<JournalFilterPicker
				anchorEl={filtersMenuButtonRef.current}
                open={showFiltersMenu}
                onClose={() => setShowFiltersMenu(false)}
			/>
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
								<Stack direction='row' alignItems='center' gap={0.5}>
									<Badge color='primary' badgeContent={numFilters} variant="standard" slotProps={{ badge: { style: { top: '10%', right: '5%' }}}}>
										<Button
											variant='contained'
											sx={(theme) => ({
												borderRadius: theme.spacing(8),
												py: 0.75,
												px: 1.5,
												// backgroundColor: theme.palette.action.hover,
												// '&:hover': {
												//     backgroundColor: theme.palette.action.selected,
												// },
											})}
											ref={filtersMenuButtonRef}
											onClick={() => setShowFiltersMenu((showing) => !showing)}
											color="inherit"
											// endIcon={<FilterAlt fontSize='small' />}
											startIcon={<Add fontSize='small' />}
										>
											<Typography>
												Filter
											</Typography>
										</Button>
									</Badge>
									<Fade in={numFilters > 0}>
										<Tooltip title='Clear filters'>
											<IconButton onClick={() => journalSliceContext.clearAllSliceFilters()}>
												<FilterAltOff fontSize='small' />
											</IconButton>
										</Tooltip>
									</Fade>
								</Stack>

							)}
						</Stack>
						<JournalDateActions />
					</Stack>
				</Stack>

				<JournalFilterRibbon />

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
