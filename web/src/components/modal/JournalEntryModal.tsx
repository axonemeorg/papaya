'use client'

import { DialogContent, DialogTitle, Grow, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import JournalEntryForm from '../form/JournalEntryForm'
import { FormProvider, useWatch } from 'react-hook-form'
import { useCallback, useContext, useEffect } from 'react'
import { NotificationsContext } from '@/contexts/NotificationsContext'
import { Category, JournalEntry, ReservedTagKey } from '@/types/schema'
import { JournalContext } from '@/contexts/JournalContext'
import DetailsDrawer from '../layout/DetailsDrawer'
import AvatarIcon from '../icon/AvatarIcon'
import { deleteJournalEntry, updateJournalEntry } from '@/database/actions'
import { PLACEHOLDER_UNNAMED_JOURNAL_ENTRY_MEMO } from '@/constants/journal'
import { useDebounce } from '@/hooks/useDebounce'
import useUnsavedChangesWarning from '@/hooks/useUnsavedChangesWarning'
import { useQueryClient } from '@tanstack/react-query'
import { Delete, Flag, LocalOffer } from '@mui/icons-material'
import { RESERVED_TAGS } from '@/constants/tags'

interface EditJournalEntryModalProps {
	open: boolean
	onClose: () => void
}

const JOURNAL_ENTRY_UNSAVED_CHANGES_WARNING_KEY = 'JOURNAL_ENTRY'

export default function JournalEntryModal(props: EditJournalEntryModalProps) {
	const { snackbar } = useContext(NotificationsContext)
	const { journal, journalEntryForm, getCategoriesQuery } = useContext(JournalContext)
	const queryClient = useQueryClient()
	const { disableUnsavedChangesWarning, enableUnsavedChangesWarning } = useUnsavedChangesWarning()

	const handleSaveFormWithCurrentValues = useCallback(async () => {
		if (!journal) {
			return Promise.resolve()
		}
		const formData: JournalEntry = journalEntryForm.getValues()
		return updateJournalEntry(formData)
			.then(() => {
				console.log('Put journal entry.')
				disableUnsavedChangesWarning(JOURNAL_ENTRY_UNSAVED_CHANGES_WARNING_KEY)
			})
			.catch((error: any) => {
				console.error(error)
				snackbar({ message: 'Failed to update journal entry' })
			})
	}, [journal]);

	const currentFormState = useWatch({ control: journalEntryForm.control })

	const entryTagIds = useWatch({ control: journalEntryForm.control, name: 'tagIds' }) ?? []
	const hasTags = entryTagIds.length > 0 && entryTagIds.some((tagId) => !ReservedTagKey.options.includes(tagId as ReservedTagKey))
	const children = useWatch({ control: journalEntryForm.control, name: 'children' }) ?? []
	const isFlagged = entryTagIds.some((tagId) => tagId === RESERVED_TAGS.FLAGGED._id)
	const childIsFlagged = children.some(child => child.tagIds?.some((tagId) => tagId === RESERVED_TAGS.FLAGGED._id))
	const memo = currentFormState.memo ?? ''
	const categoryIds = useWatch({ control: journalEntryForm.control, name: 'categoryIds' }) ?? []
	const category: Category | undefined = categoryIds[0] ? getCategoriesQuery.data[categoryIds[0]] : undefined

	const [debouncedhandleSaveFormWithCurrentValues, flushSaveFormDebounce] = useDebounce(handleSaveFormWithCurrentValues, 1000)

	const refreshJournalEntriesQuery = () => {
		queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === 'journalEntries' })
	}

	const handleClose = () => {
		props.onClose();
		if (!journalEntryForm.formState.isDirty) {
			return
		}
		flushSaveFormDebounce()
		handleSaveFormWithCurrentValues().then(() => {
			refreshJournalEntriesQuery()
			snackbar({ message: 'Saved journal entry.' })
			disableUnsavedChangesWarning(JOURNAL_ENTRY_UNSAVED_CHANGES_WARNING_KEY)
		})
	}

	const handleDelete = useCallback(async () => {
		const formData: JournalEntry = journalEntryForm.getValues()
		deleteJournalEntry(formData._id).then(() => {
			refreshJournalEntriesQuery()
			snackbar({ message: 'Deleted journal entry.' })
			disableUnsavedChangesWarning(JOURNAL_ENTRY_UNSAVED_CHANGES_WARNING_KEY)
			props.onClose()
		}).catch((error: any) => {
			console.error(error)
			snackbar({ message: 'Failed to delete journal entry' })
		})
	}, [journal])

	useEffect(() => {
		if (props.open) {
			// Prevents the user from closing the browser tab with potentially unsaved changes
			enableUnsavedChangesWarning(JOURNAL_ENTRY_UNSAVED_CHANGES_WARNING_KEY)
		}
	}, [props.open])

	useEffect(() => {
		if (!journalEntryForm.formState.isDirty) {
			return
		}
		debouncedhandleSaveFormWithCurrentValues()
		enableUnsavedChangesWarning(JOURNAL_ENTRY_UNSAVED_CHANGES_WARNING_KEY)
	}, [currentFormState])

	return (
		<FormProvider {...journalEntryForm}>
			<DetailsDrawer
				open={props.open}
				onClose={handleClose}
				actions={
					<>
						<Tooltip title='Delete Entry'>
							<IconButton onClick={() => handleDelete()}>
								<Delete />
							</IconButton>
						</Tooltip>
					</>
				}
			>
				<DialogTitle>
					<Stack direction='row' gap={1} alignItems='center'>
						<AvatarIcon avatar={category?.avatar}/>
						<Typography variant='inherit'>
							{memo.trim() || PLACEHOLDER_UNNAMED_JOURNAL_ENTRY_MEMO}
						</Typography>
						<Stack ml={1} direction='row' gap={0.5} alignItems='center'>
							{hasTags && (
								<Grow key="TAGS" in>
									<Tooltip title='Tags applied'>
										<LocalOffer fontSize='small' sx={{ cursor: 'pointer' }} />
									</Tooltip>
								</Grow>
							)}
							{(isFlagged || childIsFlagged) && (
								<Grow key="FLAGGED" in>									
									<Tooltip title={isFlagged ? 'Flagged' : 'Sub-entry is flagged'}>
										<Flag fontSize='small' sx={{ cursor: 'pointer' }} />
									</Tooltip>
								</Grow>
							)}
						</Stack>
					</Stack>
				</DialogTitle>
				<DialogContent sx={{ overflow: 'initial' }}>
					<JournalEntryForm />
				</DialogContent>
			</DetailsDrawer>
		</FormProvider>
	)
}
