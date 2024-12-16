import React, { MouseEvent, useContext, useEffect, useMemo, useState } from 'react'
import { Box, Divider } from '@mui/material'
import dayjs from 'dayjs'
import JournalHeader from './JournalHeader'
import { EnhancedJournalEntry } from '@/types/schema'
import JournalEntryCard from './JournalEntryCard'
import { deleteJournalEntry, undeleteJournalEntry } from '@/database/actions'
import { NotificationsContext } from '@/contexts/NotificationsContext'
import JournalEntryList from './JournalEntryList'
import { JournalContext } from '@/contexts/JournalContext'
import { JournalEntryContext } from '@/contexts/JournalEntryContext'
import { getDatabaseClient } from '@/database/client'

export type JournalEditorView = 'week' | 'month' | 'year' | 'all'

export interface JournalEntrySelection {
	entry: EnhancedJournalEntry | null
	anchorEl: HTMLElement | null
}

export default function JournalEditor() {
	const [selectedEntry, setSelectedEntry] = useState<JournalEntrySelection>({
		entry: null,
		anchorEl: null,
	})

	const { snackbar } = useContext(NotificationsContext)
	const journalContext = useContext(JournalContext)
	const journalEntryContext = useContext(JournalEntryContext)

	const currentDayString = useMemo(() => dayjs().format('YYYY-MM-DD'), [])

	const journalGroups = useMemo(() => {
		const entries = journalEntryContext.getEnhancedJournalEntriesQuery.data
		console.log('entries', entries)
		const groups: Record<string, EnhancedJournalEntry[]> = Object.values(entries).reduce(
			(acc: Record<string, EnhancedJournalEntry[]>, entry: EnhancedJournalEntry) => {
				const { date } = entry
				if (!date) {
					throw Error('Entry missing date:' + JSON.stringify(entry))
				}
				if (acc[date]) {
					acc[date].push(entry)
				} else {
					acc[date] = [entry]
				}

				return acc
			},
			{
				[currentDayString]: [],
			}
		)

		return groups
	}, [journalEntryContext.getEnhancedJournalEntriesQuery.data])

	const handleClickListItem = (event: MouseEvent<any>, entry: EnhancedJournalEntry) => {
		setSelectedEntry({
			anchorEl: event.currentTarget,
			entry: entry,
		})
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

	const handleDeleteEntry = async (entry: EnhancedJournalEntry | null) => {
		if (!entry) {
			return
		}

		try {
			const record = await deleteJournalEntry(entry._id)
			journalEntryContext.getEnhancedJournalEntriesQuery.refetch()
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

	// const handleSaveEntry = () => {
	// 	journalEntryContext.getEnhancedJournalEntriesQuery.refetch()
	// 	handleDeselectListItem()
	// }

	// show all docs
	useEffect(() => {
		const db = getDatabaseClient()
	    db.allDocs({ include_docs: true }).then((result) => {
	        console.log('all docs', result);
	    })
	}, []);

	return (
		<>
			<Box
				sx={{
					px: { sm: 0 },
				}}>
				{selectedEntry.entry && (
					<JournalEntryCard
						entry={selectedEntry.entry}
						anchorEl={selectedEntry.anchorEl}
						onClose={() => handleDeselectListItem()}
						onDelete={() => handleDeleteEntry(selectedEntry.entry)}
					/>
				)}
				<JournalHeader reverseActionOrder />
				<Divider />
				<JournalEntryList journalRecordGroups={journalGroups} onClickListItem={handleClickListItem} />
			</Box>
		</>
	)
}
