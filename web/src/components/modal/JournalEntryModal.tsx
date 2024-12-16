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
import { DebounceContext } from '@/contexts/DebounceContext'

interface EditJournalEntryModalProps {
	open: boolean
	onClose: () => void
}

export default function JournalEntryModal(props: EditJournalEntryModalProps) {
	const { snackbar } = useContext(NotificationsContext)
	const { journal, journalEntryForm } = useContext(JournalContext)
	const { registerDebouncedCallback } = useContext(DebounceContext);

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

	const debouncedOnChange = registerDebouncedCallback('journalEntryForm', handleSaveFormWithCurrentValues, 1000)

	const handleClose = () => {
		debouncedOnChange()
		// handleSaveFormWithCurrentValues().then(() => {
			// snackbar({ message: 'Saved journal entry.' })
		// })
		props.onClose();
	}

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
