'use client'

import { Save } from '@mui/icons-material'
import { Button, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material'
import JournalEntryForm from '../form/JournalEntryForm'
import { FormProvider } from 'react-hook-form'
import { useContext } from 'react'
import { NotificationsContext } from '@/contexts/NotificationsContext'
import { JournalEntry } from '@/types/schema'
import { putJournalEntry } from '@/database/actions'
import { JournalContext } from '@/contexts/JournalContext'
import DetailsDrawer from '../DetailsDrawer'
import AvatarIcon from '../icon/AvatarIcon'

interface EditJournalEntryModalProps {
	open: boolean
	onClose: () => void
}

export default function JournalEntryModal(props: EditJournalEntryModalProps) {
	const { snackbar } = useContext(NotificationsContext)
	const { journal, journalEntryForm } = useContext(JournalContext)

	const handleUpdateJournalEntry = (formData: JournalEntry) => {
		if (!journal) {
			return
		}
		putJournalEntry(formData)
			.then(() => {
				//
			})
			.catch((error: any) => {
				console.error(error)
				snackbar({ message: 'Failed to update journal entry' })
			})
	}

	return (
		<FormProvider {...journalEntryForm}>
			<DetailsDrawer open={props.open} onClose={props.onClose}>
				<form onSubmit={journalEntryForm.handleSubmit(handleUpdateJournalEntry)}>
					<DialogTitle>
						<Stack direction='row' gap={1} alignItems='center'>
							<AvatarIcon />
							<Typography variant='inherit'>{journalEntryForm.watch('memo') || 'New Entry'}</Typography>
						</Stack>
					</DialogTitle>				
					<DialogContent sx={{ overflow: 'initial' }}>
						<JournalEntryForm />
					</DialogContent>
					<DialogActions>
						<Button onClick={() => props.onClose()}>Cancel</Button>
						<Button type="submit" variant="contained" startIcon={<Save />}>
							Save
						</Button>
					</DialogActions>
				</form>
			</DetailsDrawer>
		</FormProvider>
	)
}
