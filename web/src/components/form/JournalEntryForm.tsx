'use client'

import {
	Box,
	Divider,
	Grid2 as Grid,
	Stack,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
	Tooltip,
} from '@mui/material'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { JournalEntry } from '@/types/schema'
import AmountField from '../input/AmountField'
import CategorySelector from '../input/CategorySelector'
import ChildJournalEntryForm from './ChildJournalEntryForm'
import { useEffect } from 'react'
import EntryArtifactsForm from './EntryArtifactsForm'
import { getJournalEntryWithAttachments } from '@/database/queries'
import EntryTagSelector from '../input/EntryTagSelector'
import EntryNoteForm from './EntryNoteForm'
import EntryTasksForm from './EntryTasksForm'
import AccountAutocomplete from '../input/AccountAutocomplete'
import { Book, InfoOutlined, TransferWithinAStation } from '@mui/icons-material'

export default function JournalEntryForm() {
	const { setValue, control, register } = useFormContext<JournalEntry>()

	const categoryIds = useWatch({ control, name: 'categoryIds' })
	const sourceAccountId = useWatch({ control, name: 'sourceAccountId' })
	const entryTagIds = useWatch({ control, name: 'tagIds' })
	const attachments = useWatch({ control, name: '_attachments' }) ?? {}
	const journalEntryId = useWatch({ control, name: '_id' })

	useEffect(() => {
		getJournalEntryWithAttachments(journalEntryId)
			.then((entry) => {
				setValue('_attachments', { ...attachments, ...(entry._attachments ?? {}) })
			})
			.catch()
	}, [journalEntryId])

	return (
		<>
			<Box sx={{ position: 'relative' /* Used for attachment drag overlay */ }}>
				<ToggleButtonGroup value={'JOURNAL_ENTRY'} size='small'>
					<ToggleButton value='JOURNAL_ENTRY'>
						<Stack direction='row' gap={0.5} alignItems='center'>
							<Book sx={{ mr: 0 }} />
							<span>Ledger</span>
							<Tooltip title="Journal entry"><InfoOutlined fontSize='small' /></Tooltip>
						</Stack>
					</ToggleButton>
					<ToggleButton value='ACCOUNT_TRANSFER_ENTRY'>
						<Stack direction='row' gap={0.5} alignItems='center'>
							<TransferWithinAStation sx={{ mr: 0 }} />
							<span>Transfer</span>
							<Tooltip title="Transfer between accounts"><InfoOutlined fontSize='small' /></Tooltip>
						</Stack>
					</ToggleButton>
				</ToggleButtonGroup>
				<Grid container columns={12} spacing={4} rowSpacing={2} mb={1} sx={{ px: 0 }}>
					<Grid size={12}>
						{/* <Stack direction='row' sx={{ pt: 0, pb: 2 }}>
							<Button variant='outlined' startIcon={<SubdirectoryArrowRight />} onClick={() => handleAddChildEntry()}>
								Add Sub-Entry
							</Button>
						</Stack> */}
					</Grid>
					<Grid size={7}>
						<Grid container columns={12} spacing={2} rowSpacing={2} mb={1}>
							<Grid size={12}>
								<TextField
									label="Memo"
									variant='filled'
									autoFocus
									// ref={null}
									{...register('memo')}
									fullWidth
									multiline
									maxRows={3}
								/>
							</Grid>
							<Grid size={12}>
								<Controller
									control={control}
									name="date"
									render={({ field }) => (
										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<DatePicker
												{...field}
												value={dayjs(field.value)}
												onChange={(value) => {
													setValue(field.name, value?.format('YYYY-MM-DD') ?? '', { shouldDirty: true })
												}}
												format="ddd, MMM D"
												label="Date"
												slotProps={{
													textField: {
														fullWidth: true,
														variant: 'filled'
													},
												}}
											/>
										</LocalizationProvider>
									)}
								/>
							</Grid>
							<Grid size={8}>
								<Controller
									control={control}
									name="amount"
									render={({ field }) => (
										<AmountField
											variant='filled'
											{...field}
											fullWidth
											sx={{ flex: 1 }}
											autoComplete="off"
										/>
									)}
								/>
							</Grid>
							<Grid size={4}>
								<Controller
									control={control}
									name="sourceAccountId"
									render={({ field }) => {
										return (
											<AccountAutocomplete
												{...field}
												value={sourceAccountId}
												onChange={(_event, newValue) => {
													setValue(field.name, newValue ?? undefined, { shouldDirty: true })
												}}
												renderInput={(params) => <TextField {...params} label={'Account'} variant='filled' />}
											/>
										)
									}}
								/>
							</Grid>
						</Grid>					
						<ChildJournalEntryForm />
						<EntryArtifactsForm />
					</Grid>
					<Grid size={5}>
						<Stack gap={3} pt={1}>
							<Controller
								control={control}
								name="categoryIds"
								render={({ field }) => {
									return (
										<CategorySelector
											{...field}
											value={categoryIds}
											onChange={(_event, newValue) => {
												setValue(field.name, newValue ?? [], { shouldDirty: true })
											}}
										/>
									)
								}}
							/>
							<Divider flexItem />
							<Controller
								control={control}
								name="tagIds"
								render={({ field }) => {
									return (
										<EntryTagSelector
											{...field}
											value={entryTagIds}
											onChange={(_event, newValue) => {
												setValue(field.name, newValue ?? [], { shouldDirty: true })
											}}
										/>
									)
								}}
							/>
							<Divider flexItem />
							<EntryTasksForm />
							<Divider flexItem />
							<EntryNoteForm />
						</Stack>
					</Grid>
				{/* <AttachmentDropzone onFilesAdded={handleAddFiles}>
					<AttachmentButton />
				</AttachmentDropzone> */}
				</Grid>
			</Box>
		</>
	)
}
