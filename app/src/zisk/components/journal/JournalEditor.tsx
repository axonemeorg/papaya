import { MouseEvent, useContext, useEffect, useMemo, useState } from 'react'
import { Box, Divider, Paper, Stack } from '@mui/material'
import JournalHeader from './ribbon/JournalHeader'
import { JournalEntry, TransferEntry } from '@/types/schema'
import JournalEntryCard from './JournalEntryCard'
import { deleteJournalEntry, undeleteJournalEntry } from '@/database/actions'
import { NotificationsContext } from '@/contexts/NotificationsContext'
import JournalEntryList from './JournalEntryList'
import { JournalContext } from '@/contexts/JournalContext'
import { JournalSliceContext } from '@/contexts/JournalSliceContext'
import { getDatabaseClient } from '@/database/client'
import SpendChart from '../chart/SpendChart'
import CategorySpreadChart from '../chart/CategorySpreadChart'
import { useSearch } from '@tanstack/react-router'

export interface JournalEntrySelection {
	entry: JournalEntry | TransferEntry | null
	anchorEl: HTMLElement | null
}

export default function JournalEditor() {
	const [selectedEntry, setSelectedEntry] = useState<JournalEntrySelection>({
		entry: null,
		anchorEl: null,
	})

	const { snackbar } = useContext(NotificationsContext)
	const journalContext = useContext(JournalContext)
	const journalSliceContext = useContext(JournalSliceContext)

	const { tab } = useSearch({ from: '/_mainLayout/journal/$view/$' })

	const journalGroups = useMemo(() => {
		const entries = journalSliceContext.getJournalEntriesQuery.data
		const groups: Record<JournalEntry['_id'], JournalEntry[]> = Object.values(entries).reduce(
			(acc: Record<JournalEntry['_id'], JournalEntry[]>, entry: JournalEntry) => {
				const { date } = entry
				if (!date) {
					return acc
				}
				if (acc[date]) {
					acc[date].push(entry)
				} else {
					acc[date] = [entry]
				}

				return acc
			}, {}
		)

		return groups
	}, [journalSliceContext.getJournalEntriesQuery.data])

	const transferGroups = useMemo(() => {
		const entries = journalSliceContext.getTransferEntriesQuery.data
		const groups: Record<TransferEntry['_id'], TransferEntry[]> = Object.values(entries).reduce(
			(acc: Record<TransferEntry['_id'], TransferEntry[]>, entry: TransferEntry) => {
				const { date } = entry
				if (!date) {
					return acc
				}
				if (acc[date]) {
					acc[date].push(entry)
				} else {
					acc[date] = [entry]
				}

				return acc
			}, {}
		)

		return groups
	}, [journalSliceContext.getJournalEntriesQuery.data])

	const handleClickListItem = (event: MouseEvent<any>, entry: JournalEntry | TransferEntry) => {
		setSelectedEntry({
			anchorEl: event.currentTarget,
			entry: entry,
		})
	}

	const handleDoubleClickListItem = (_event: MouseEvent<any>, entry: JournalEntry| TransferEntry) => {
		journalContext.editJournalEntry(entry)
	}

	const handleDeselectListItem = () => {
		setSelectedEntry((prev) => {
			const next = {
				...prev,
				anchorEl: null,
			}
			return next
		})
	}

	const handleDeleteEntry = async (entry: JournalEntry | TransferEntry | null) => {
		if (!entry) {
			return
		}

		try {
			const record = await deleteJournalEntry(entry._id)
			journalSliceContext.refetchAllDependantQueries()
			handleDeselectListItem()
			snackbar({
				message: 'Deleted 1 entry',
				action: {
					label: 'Undo',
					onClick: async () => {
						undeleteJournalEntry(record)
							.then(() => {
								journalContext.getCategoriesQuery.refetch()
								snackbar({ message: 'Category restored' })
							})
							.catch((error) => {
								console.error(error)
								snackbar({ message: 'Failed to restore category: ' + error.message })
							})
					},
				},
			})
		} catch {
			snackbar({ message: 'Failed to delete entry' })
		}
	}

	// show all docs
	useEffect(() => {
		const db = getDatabaseClient()
	    db.allDocs({ include_docs: true }).then((result) => {
	        console.log('all docs', result);
	    })
	}, []);

	return (
		<>
			{selectedEntry.entry && (
				<JournalEntryCard
					entry={selectedEntry.entry}
					anchorEl={selectedEntry.anchorEl}
					onClose={() => handleDeselectListItem()}
					onDelete={() => handleDeleteEntry(selectedEntry.entry)}
				/>
			)}
			<Stack direction="row" sx={{ gap: 2, overflow: 'hidden', flex: 1, pr: 2, pb: { sm: 0, md: 2 } }}>
				<Stack
					sx={{
						overflow: 'hidden',
						flex: 2,
						gap: 2,
					}}
				>
					{/* <Grid columns={12} container>
						<Grid size={4}> */}
					<Stack direction='row' gap={2}>
						<SpendChart />
						<CategorySpreadChart />
					</Stack>
						{/* </Grid>
					</Grid> */}
					
					<Stack
						component={Paper}
						sx={(theme) => ({
							flex: 1,
							borderTopLeftRadius: theme.spacing(2),
							borderTopRightRadius: theme.spacing(2),
							borderBottomLeftRadius: { sm: 0, md: theme.spacing(2) },
							borderBottomRightRadius: { sm: 0, md: theme.spacing(2) },
							overflow: 'hidden',
						})}
					>
						<JournalHeader />
						<Divider />
						<Box sx={{
							flex: 1,
							overflowY: 'auto',
						}}>
							<JournalEntryList
								type={tab === 'journal' ? 'JOURNAL_ENTRY' : 'TRANSFER_ENTRY'}
								journalRecordGroups={tab === 'journal' ? journalGroups : transferGroups}
								onClickListItem={handleClickListItem}
								onDoubleClickListItem={handleDoubleClickListItem}
							/>
							<Stack component='footer'></Stack>
						</Box>
					</Stack>
				</Stack>
				{/* <Stack
					component={Paper}
					sx={(theme) => ({
						borderTopLeftRadius: theme.spacing(2),
						borderTopRightRadius: theme.spacing(2),
						overflow: 'hidden',
						flex: 1,
					})}>
					<Stack component='header'>
						<Stack
							direction="row"
							justifyContent="space-between"
							sx={{ flex: 0, py: 1, px: 2 }}
							alignItems="center"
							gap={1}
						>
							<Typography>Analysis</Typography>
							<IconButton><Close /></IconButton>
						</Stack>
					</Stack>
					<Divider />
					<Box sx={{
						flex: 1,
						overflowY: 'auto',
					}}>
						
					</Box>
				</Stack> */}
				
			</Stack>
		</>
	)
}
