'use client'

import {
	Box,
	Button,
	Grid2 as Grid,
	Link,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { AttachmentMeta, EntryArtifact, JournalEntry } from '@/types/schema'
import { Add, SubdirectoryArrowRight } from '@mui/icons-material'
import AmountField from '../input/AmountField'
import CategorySelector from '../input/CategorySelector'
import ChildJournalEntryForm from './ChildJournalEntryForm'
import { useCallback, useContext, useEffect, useState } from 'react'
import { makeEntryArtifact, makeJournalEntry } from '@/utils/journal'
import { JournalContext } from '@/contexts/JournalContext'
import EntryArtifactsForm from './EntryArtifactsForm'
import { useFilePrompt } from '@/hooks/useFilePrompt'
import { fileToBase64 } from '@/utils/file'
import { getJournalEntryWithAttachments } from '@/database/queries'

export default function JournalEntryForm() {
	const { setValue, control, register } = useFormContext<JournalEntry>()
	const [selectedRows, setSelectedRows] = useState<string[]>([])

	const journalContext = useContext(JournalContext)

	const promptForFiles = useFilePrompt()

	const childEntriesFieldArray = useFieldArray({
		control,
		name: 'children',
	})

	const entriesArtifactsFieldArray = useFieldArray({
		control,
		name: 'artifacts',
	})

	const categoryIds = useWatch({ control, name: 'categoryIds' })
	const children = useWatch({ control, name: 'children' }) ?? []
	const artifacts = useWatch({ control, name: 'artifacts' }) ?? []
	const attachments = useWatch({ control, name: '_attachments' }) ?? {}
	const journalEntryId = useWatch({ control, name: '_id' })

	const handleAddChildEntry = useCallback(() => {
		if (!journalContext.journal) {
			return
		}
		const newEntry: JournalEntry = makeJournalEntry({}, journalContext.journal._id)
		if (children) {
			childEntriesFieldArray.prepend(newEntry)
		} else {
			setValue('children', [newEntry])
		}
	}, [children])

	const handleAddArtifact = async () => {
		if (!journalContext.journal) {
			return
		}

		const journalId = journalContext.journal._id

		
		const files = await promptForFiles("image/*", true)

		if (!Array.isArray(files)) {
			return
		}

		const newArtifacts: EntryArtifact[] = [];
		const newAttachments: Record<string, AttachmentMeta> = {}

		for (const file of files) {
			const artifact = makeEntryArtifact({
				contentType: file.type,
				size: file.size,
				originalFileName: file.name,
				description: '',
			}, journalId)
			console.log('NEW artifact:', artifact)

			newArtifacts.push(artifact)
			newAttachments[artifact._id] = {
				content_type: file.type,
				// data: await fileToBase64(file),
				data: file
			}
		}

		if (artifacts) {
			newArtifacts.forEach((artifact) => entriesArtifactsFieldArray.prepend(artifact))
		} else {
			setValue('artifacts', newArtifacts)
		}

		setValue('_attachments', { ...attachments, ...newAttachments })
	}

	useEffect(() => {
		getJournalEntryWithAttachments(journalEntryId)
			.then((entry) => {
				setValue('_attachments', { ...attachments, ...(entry._attachments ?? {}) })
			})
			.catch()
	}, [journalEntryId])

	return (
		<>
			{/* <EntryTagPicker
				anchorEl={entryTagPickerData.anchorEl}
				onClose={() => setEntryTagPickerData((prev) => ({ ...prev, anchorEl: null }))}
				value={entryTagPickerSelectedTags}
				onChange={(tagIds: EntryTag['_id'][]) => {
					setValue(`children.${entryTagPickerData.index}.tagIds`, tagIds)
				}}
			/> */}
			<Box sx={{ position: 'relative' /* Used for attachment drag overlay */ }}>
				<Grid container columns={12} spacing={3} rowSpacing={2} mb={1} sx={{ px: 0 }}>
					<Grid size={12}>
						<Stack direction='row' sx={{ pt: 0, pb: 2 }}>
							<Button variant='outlined' startIcon={<SubdirectoryArrowRight />} onClick={() => handleAddChildEntry()}>
								Add Sub-Entry
							</Button>
						</Stack>
					</Grid>
					<Grid size={8}>
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
						</Grid>
						{/* <Stack>
							{childrenFieldArray.fields.map((field, index) => {
								return (
									<JournalEntryChildRow
										key={field.id}
										index={index}
										fieldArray={childrenFieldArray.fields}
										remove={childrenFieldArray.remove}
										onClickTagButton={(event) => {
											setEntryTagPickerData({
												anchorEl: event.currentTarget,
												index,
											})
										}}
										entryTags={getEntryTagsQuery.data}
									/>
								)
							})}
						</Stack> */}
						<Stack direction='row' alignItems={'center'} justifyContent={'space-between'} mt={4}>
							<Typography>Sub-Entries ({children.length})</Typography>
							<Button onClick={() => handleAddChildEntry()} startIcon={<Add />}>Add Row</Button>
						</Stack>
						{children.length === 0 && (
							<Typography variant='body2' color='textSecondary'>
								No sub-entries. <Link onClick={() => handleAddChildEntry()} sx={{ cursor: 'pointer' }}>Click to add one.</Link>
							</Typography>
						)}
						<Stack mt={2} mx={-1} spacing={1}>
							<ChildJournalEntryForm
								fieldArray={childEntriesFieldArray}
								selection={selectedRows}
								onSelectionChange={setSelectedRows}
							/>								
						</Stack>
						<Stack direction='row' alignItems={'center'} justifyContent={'space-between'} mt={2}>
							<Typography>Attachments ({artifacts.length})</Typography>
							<Button onClick={() => handleAddArtifact()} startIcon={<Add />}>Add Attachment</Button>
						</Stack>
						{artifacts.length === 0 && (
							<Typography variant='body2' color='textSecondary'>
								No attachments. <Link onClick={() => handleAddArtifact()} sx={{ cursor: 'pointer' }}>Click to add one.</Link>
							</Typography>
						)}
						<Stack mt={2} mx={-1} spacing={1}>
							<EntryArtifactsForm
								control={control}
								fieldArray={entriesArtifactsFieldArray}
								selection={selectedRows}
								onSelectionChange={setSelectedRows}
							/>								
						</Stack>
					</Grid>
					<Grid size={4}>
						<Stack>
							<Controller
								control={control}
								name="categoryIds"
								render={({ field }) => {
									// const categoryId: Category['_id'] | null = !categoryIds?.length ? null : categoryIds[0]

									return (
										<CategorySelector
											{...field}
											// ref={null}
											// variant='filled'
											value={categoryIds}
											onChange={(_event, newValue) => {
												// setManuallySetCategory(Boolean(newValue))
												setValue(field.name, newValue ?? [], { shouldDirty: true })
											}}
										/>
									)
								}}
							/>
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
