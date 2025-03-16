import React, { MouseEvent, useContext, useEffect, useMemo, useState } from 'react'
import { Box, Divider, Paper, Stack } from '@mui/material'
import JournalHeader from './JournalHeader'
import { JournalEntry } from '@/types/schema'
import JournalEntryCard from './JournalEntryCard'
import { deleteJournalEntry, undeleteJournalEntry } from '@/database/actions'
import { NotificationsContext } from '@/contexts/NotificationsContext'
import JournalEntryList from './JournalEntryList'
import { JournalContext } from '@/contexts/JournalContext'
import { JournalEntryContext } from '@/contexts/JournalEntryContext'

export type JournalEditorView = 'week' | 'month' | 'year' | 'all'

export interface JournalEntrySelection {
	entry: JournalEntry | null
	anchorEl: HTMLElement | null
}

export default function JournalEditor() {
	const [selectedEntry, setSelectedEntry] = useState<JournalEntrySelection>({
		entry: null,
		anchorEl: null,
	})
	const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({})

	const { snackbar } = useContext(NotificationsContext)
	const journalContext = useContext(JournalContext)
	const journalEntryContext = useContext(JournalEntryContext)

	const journalGroups = useMemo(() => {
		const entries = journalEntryContext.getJournalEntriesQuery.data
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
	}, [journalEntryContext.getJournalEntriesQuery.data])

	const handleClickListItem = (event: MouseEvent<any>, entry: JournalEntry) => {
		setSelectedEntry({
			anchorEl: event.currentTarget,
			entry: entry,
		})
	}

	const handleDoubleClickListItem = (_event: MouseEvent<any>, entry: JournalEntry) => {
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

	const handleDeleteEntry = async (entry: JournalEntry | null) => {
		if (!entry) {
			return
		}

		try {
			const record = await deleteJournalEntry(entry._id)
			journalEntryContext.refetchAllDependantQueries()
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

	const toggleSelectedRow = (row: string) => {
		setSelectedRows((prev) => {
			return {
				...prev,
				[row]: prev[row] ? false : true
			}
		})
	}

	// show all docs
	useEffect(() => {
		// const db = getDatabaseClient()
	    // db.allDocs({ include_docs: true }).then((result) => {
	    //     console.log('all docs', result);
	    // })
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
			<Stack
				component={Paper}
				sx={(theme) => ({
					px: { sm: 0 },
					borderTopLeftRadius: theme.spacing(2),
					overflow: 'hidden',
					flex: 1,
				})}>
				<JournalHeader />
				<Divider />
				<Box sx={{
					flex: 1,
					overflowY: 'auto',
				}}>
					<JournalEntryList
						selectedRows={selectedRows}
						toggleSelectedRow={toggleSelectedRow}
						journalRecordGroups={journalGroups}
						onClickListItem={handleClickListItem}
						onDoubleClickListItem={handleDoubleClickListItem}
					/>
				</Box>
			</Stack>
		</>
	)
}
