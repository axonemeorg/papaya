'use client'

import { Save } from '@mui/icons-material'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material'
import JournalEntryForm from '../form/JournalEntryForm'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext, useEffect } from 'react'
import { NotificationsContext } from '@/contexts/NotificationsContext'
import { EditJournalEntryForm } from '@/types/schema'
import { createOrUpdateJournalEntry } from '@/database/actions'

interface EditJournalEntryModalProps {
	open: boolean
	initialValues: EditJournalEntryForm
	onClose: () => void
	onSave: () => void
}

export default function EditJournalEntryModal(props: EditJournalEntryModalProps) {
	const { snackbar } = useContext(NotificationsContext)

	const handleUpdateJournalEntry = (formData: EditJournalEntryForm) => {
		console.log('handleUpdateJournalEntry', formData)
		console.log('props.initialValues:', props.initialValues)
		createOrUpdateJournalEntry(formData)
			.then(() => {
				props.onClose()
				snackbar({ message: 'Updated journal entry' })
				props.onSave()
			})
			.catch((error) => {
				console.error(error)
				snackbar({ message: 'Failed to update journal entry' })
			})
	}

	const editJournalEntryForm = useForm<EditJournalEntryForm>({
		defaultValues: {
			...props.initialValues,
		},
		resolver: zodResolver(EditJournalEntryForm),
	})

	useEffect(() => {
		editJournalEntryForm.reset({ ...props.initialValues })
	}, [props.initialValues])

	useEffect(() => {
		if (props.open) {
			editJournalEntryForm.reset()
		}
	}, [props.open])

	const theme = useTheme()
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

	return (
		<FormProvider {...editJournalEntryForm}>
			<Dialog open={props.open} fullScreen={fullScreen} fullWidth onClose={props.onClose} maxWidth="md">
				<form onSubmit={editJournalEntryForm.handleSubmit(handleUpdateJournalEntry)}>
					<DialogTitle>Edit Entry</DialogTitle>
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
			</Dialog>
		</FormProvider>
	)
}
