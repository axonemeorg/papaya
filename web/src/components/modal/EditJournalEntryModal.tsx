'use client'

import { Save } from '@mui/icons-material'
import { Button, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material'
import JournalEntryForm from '../form/JournalEntryForm'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext, useEffect } from 'react'
import { NotificationsContext } from '@/contexts/NotificationsContext'
import { EditJournalEntryForm } from '@/types/schema'
import { createOrUpdateJournalEntry } from '@/database/actions'
import { JournalContext } from '@/contexts/JournalContext'
import DetailsDrawer from '../DetailsDrawer'
import AvatarIcon from '../icon/AvatarIcon'

interface EditJournalEntryModalProps {
	open: boolean
	initialValues: EditJournalEntryForm
	onClose: () => void
	onSave: () => void
}

export default function EditJournalEntryModal(props: EditJournalEntryModalProps) {
	const { snackbar } = useContext(NotificationsContext)
	const { journal } = useContext(JournalContext)

	const handleUpdateJournalEntry = (formData: EditJournalEntryForm) => {
		if (!journal) {
			return
		}
		createOrUpdateJournalEntry(formData, journal._id)
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

	return (
		<FormProvider {...editJournalEntryForm}>
			<DetailsDrawer open={props.open} onClose={props.onClose}>
				<form onSubmit={editJournalEntryForm.handleSubmit(handleUpdateJournalEntry)}>
					<DialogTitle>
						<Stack direction='row' gap={1} alignItems='center'>
							<AvatarIcon />
							<Typography variant='inherit'>{editJournalEntryForm.watch('parent.memo') || 'New Entry'}</Typography>
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
