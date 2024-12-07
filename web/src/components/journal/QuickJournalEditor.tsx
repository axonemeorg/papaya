import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import QuickJournalEntryForm from '../form/QuickJournalEntryForm'
import { Box, Button, Stack } from '@mui/material'
import { Add, Save } from '@mui/icons-material'
import { useContext, useState } from 'react'
import { CreateQuickJournalEntry } from '@/types/schema'
import { createQuickJournalEntry } from '@/database/actions'
import { NotificationsContext } from '@/contexts/NotificationsContext'

interface QuickJournalEditorProps {
	onAdd?: () => void
}

export default function QuickJournalEditor(props: QuickJournalEditorProps) {
	const [isActive, setIsActive] = useState<boolean>(false)

	const { snackbar } = useContext(NotificationsContext)

	const createQuickJournalEntryForm = useForm<CreateQuickJournalEntry>({
		defaultValues: {
			memo: '',
			// category: undefined,
			amount: undefined,
		},
		resolver: zodResolver(CreateQuickJournalEntry),
	})

	const handleCreateQuickJournalEntry = async (formData: CreateQuickJournalEntry) => {
		const now = new Date().toISOString()
		createQuickJournalEntry(formData, now).then(() => {
			createQuickJournalEntryForm.reset()
		})
		snackbar({ message: 'Created journal entry.' })
	}

	return (
		<FormProvider {...createQuickJournalEntryForm}>
			<form onSubmit={createQuickJournalEntryForm.handleSubmit(handleCreateQuickJournalEntry)}>
				<Box px={2} py={1}>
					{isActive ? (
						<Stack direction="row">
							<QuickJournalEntryForm />
							<Button type="submit" startIcon={<Save />}>
								Save
							</Button>
							<Button onClick={() => setIsActive(false)}>Cancel</Button>
						</Stack>
					) : (
						<Button
							size="small"
							startIcon={<Add />}
							onClick={() => {
								if (props.onAdd) {
									props.onAdd()
								} else {
									setIsActive(true)
								}
							}}>
							New Entry
						</Button>
					)}
				</Box>
			</form>
		</FormProvider>
	)
}
