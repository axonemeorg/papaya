'use client'

import { DialogContent, DialogTitle, Stack, Typography } from '@mui/material'
import JournalEntryForm from '../form/JournalEntryForm'
import { FormProvider, useWatch } from 'react-hook-form'
import { useCallback, useContext, useRef, useEffect } from 'react'
import { NotificationsContext } from '@/contexts/NotificationsContext'
import { JournalEntry } from '@/types/schema'
import { JournalContext } from '@/contexts/JournalContext'
import DetailsDrawer from '../DetailsDrawer'
import AvatarIcon from '../icon/AvatarIcon'
import { updateJournalEntry } from '@/database/actions'
import { PLACEHOLDER_UNNAMED_JOURNAL_ENTRY_MEMO } from '@/constants/journal'

interface EditJournalEntryModalProps {
	open: boolean
	onClose: () => void
}

export default function JournalEntryModal(props: EditJournalEntryModalProps) {
	const { snackbar } = useContext(NotificationsContext)
	const { journal, journalEntryForm } = useContext(JournalContext)

	const handleSaveFormWithCurrentValues = useCallback(async () => {
		if (!journal) {
			return Promise.resolve()
		}
		const formData: JournalEntry = journalEntryForm.getValues()
		return updateJournalEntry(formData)
			.then(() => {
				console.log('Put successful')
			})
			.catch((error: any) => {
				console.error(error)
				snackbar({ message: 'Failed to update journal entry' })
			})
	}, [journal]);

	const currentMemoValue = useWatch({ control: journalEntryForm.control, name: 'memo' })

	// Ref to store the debounce timeout ID
	const debounceTimeout = useRef<number | null>(null);

	// Inline debounced onChange handler
	const debouncedOnChange = useCallback(() => {
		// Clear any existing timeout
		if (debounceTimeout.current !== null) {
			clearTimeout(debounceTimeout.current);
		}

		// Set a new timeout
		debounceTimeout.current = window.setTimeout(() => {
			handleSaveFormWithCurrentValues();
		}, 1000);
	}, [handleSaveFormWithCurrentValues, journalEntryForm]);

	const handleClose = () => {
		// Clear the debounce timeout on close
		if (debounceTimeout.current !== null) {
			clearTimeout(debounceTimeout.current);
			debounceTimeout.current = null;
		}
		journal
		handleSaveFormWithCurrentValues().then(() => {
			snackbar({ message: 'Saved journal entry.' })
		})
		props.onClose();
	}

	// Clear the debounce timeout when the drawer is closed
	useEffect(() => {
		if (!props.open && debounceTimeout.current !== null) {
			clearTimeout(debounceTimeout.current);
			debounceTimeout.current = null;
		}
	}, [props.open]);

	return (
		<FormProvider {...journalEntryForm}>
			<DetailsDrawer
				open={props.open}
				onClose={handleClose}
			>
				<form onChange={debouncedOnChange}>
					<DialogTitle>
						<Stack direction='row' gap={1} alignItems='center'>
							<AvatarIcon />
							<Typography variant='inherit'>
								{currentMemoValue || PLACEHOLDER_UNNAMED_JOURNAL_ENTRY_MEMO}
							</Typography>
						</Stack>
					</DialogTitle>
					<DialogContent sx={{ overflow: 'initial' }}>
						<JournalEntryForm />
					</DialogContent>
				</form>
			</DetailsDrawer>
		</FormProvider>
	)
}
