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
import { useDebounce } from '@/hooks/useDebounce'
import useUnsavedChangesWarning from '@/hooks/useUnsavedChangesWarning'
import { useQueryClient } from '@tanstack/react-query'

interface EditJournalEntryModalProps {
	open: boolean
	onClose: () => void
}

export default function JournalEntryModal(props: EditJournalEntryModalProps) {
	const { snackbar } = useContext(NotificationsContext)
	const { journal, journalEntryForm } = useContext(JournalContext)
	const queryClient = useQueryClient()
	const { disableUnsavedChangesWarning, enableUnsavedChangesWarning } = useUnsavedChangesWarning(true)

	useEffect(() => {
		if (props.open) {
			// Prevents the user from closing the browser tab with potentially unsaved changes
			enableUnsavedChangesWarning()
		}
	}, [props.open])

	const handleSaveFormWithCurrentValues = useCallback(async () => {
		if (!journal) {
			return Promise.resolve()
		}
		const formData: JournalEntry = journalEntryForm.getValues()
		return updateJournalEntry(formData)
			.then(() => {
				console.log('Put journal entry.')
				disableUnsavedChangesWarning()
			})
			.catch((error: any) => {
				console.error(error)
				snackbar({ message: 'Failed to update journal entry' })
			})
	}, [journal]);

	const currentMemoValue = useWatch({ control: journalEntryForm.control, name: 'memo' })

	const [debouncedhandleSaveFormWithCurrentValues, flushSaveFormDebounce] = useDebounce(handleSaveFormWithCurrentValues, 1000)

	const handleChange = () => {
		debouncedhandleSaveFormWithCurrentValues()
		enableUnsavedChangesWarning()
	}

	const handleClose = () => {
		flushSaveFormDebounce()
		handleSaveFormWithCurrentValues().then(() => {
			queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === 'enhancedJournalEntries' })
			snackbar({ message: 'Saved journal entry.' })
			disableUnsavedChangesWarning()
		})
		props.onClose();
	}

	return (
		<FormProvider {...journalEntryForm}>
			<DetailsDrawer
				open={props.open}
				onClose={handleClose}
			>
				<form onChange={() => handleChange()}>
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
