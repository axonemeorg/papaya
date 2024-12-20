'use client'

import {
	Box,
	Button,
	Grid2 as Grid,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { JournalEntry } from '@/types/schema'
import { Add, SubdirectoryArrowRight } from '@mui/icons-material'
// import { JournalContext } from '@/contexts/JournalContext'
import AmountField from '../input/AmountField'
import CategorySelector from '../input/CategorySelector'
import ChildJournalEntryForm from './ChildJournalEntryForm'
import { useContext, useEffect, useState } from 'react'
import { makeJournalEntry } from '@/utils/journal'
import { JournalContext } from '@/contexts/JournalContext'
import { createJournalEntry, updateJournalEntryChildren } from '@/database/actions'
import { useQuery } from '@tanstack/react-query'
import { getJournalEntryChildren } from '@/database/queries'
import { useDebounce } from '@/hooks/useDebounce'

// interface AttachmentRowProps {
// 	onRemove: () => void
// 	index: number
// }

// const AttachmentRow = (props: AttachmentRowProps) => {
// 	const { index, onRemove } = props
// 	const { watch, register } = useFormContext<CreateJournalEntryForm>()

// 	const artifact = watch(`artifacts.${index}`)

// 	// Check if the artifact's file has an content type of image. If so, we create a URL for it
// 	const imageSrc: string | null = useMemo(() => {
// 		const attachment = artifact._attachments[artifact.filename]
// 		if (attachment.content_type.startsWith('image')) {
// 			const blob = new Blob([attachment.data], { type: attachment.content_type })
// 			return URL.createObjectURL(blob)
// 		}

// 		return null
// 	}, [artifact])

// 	return (
// 		<Stack direction="row" alignItems="flex-start" spacing={1}>
// 			<Card sx={{ aspectRatio: 4 / 5, width: 128 }}>
// 				{imageSrc ? (
// 					<CardMedia component="img" sx={{ objectFit: 'cover' }} height={'100%'} image={imageSrc} />
// 				) : (
// 					<MuiAvatar>
// 						<Folder />
// 					</MuiAvatar>
// 				)}
// 			</Card>
// 			<Stack gap={0.5} sx={{ flex: 1, justifyContent: 'space-between' }}>
// 				<Stack direction="row" gap={1}>
// 					<Typography variant="body1">{artifact.filename}</Typography>
// 					<Typography variant="body2">{formatFileSize(artifact.filesize)}</Typography>
// 				</Stack>
// 				<TextField
// 					label="Description"
// 					placeholder="Enter a description for this attachment"
// 					{...register(`artifacts.${index}.description`)}
// 					fullWidth
// 					multiline
// 					rows={2}
// 				/>
// 			</Stack>
// 			<IconButton onClick={() => onRemove()}>
// 				<Delete />
// 			</IconButton>
// 		</Stack>
// 	)
// }

export default function JournalEntryForm() {
	const journalContext = useContext(JournalContext)
	const { setValue, control, register } = useFormContext<JournalEntry>()
	const [selectedRowsSet, setSelectedRowsSet] = useState<Set<string>>(new Set<string>([]))
	const [children, setChildren] = useState<Record<JournalEntry['_id'], JournalEntry>>({})

	const categoryIds = useWatch({ control, name: 'categoryIds' })
	const date = useWatch({ control, name: 'date' })
	const parentEntryId = useWatch({ control, name: '_id' })

	const handleAddChildEntry = () => {
		if (!journalContext.journal) {
			return
		}
		const newChildEntry: JournalEntry = makeJournalEntry({ date, parentEntryId }, journalContext.journal._id)
		setChildren((prev) => ({ ...prev, [newChildEntry._id]: newChildEntry }))
		createJournalEntry(newChildEntry)
	}

	const handleChangeChildEntry = (entry: JournalEntry) => {
		console.log('handleChangeChildEntry', entry)
		setChildren((prev) => ({ ...prev, [entry._id]: entry }))
	}

	const journalEntryChildrenQuery = useQuery({
		queryKey: ['journalEntryChildrenByJournalEntryId', parentEntryId],
		queryFn: async () => {
			return getJournalEntryChildren(parentEntryId)
		},
		initialData: [],
	})

	const handleUpdateChildrenEntries = async () => {
		const childrenEntries = Object.values(children)
		updateJournalEntryChildren(childrenEntries).then(() => {
			console.log('updated children entries:', childrenEntries)
		})
	}

	const [debouncedhandleSaveChildrenWithCurrentValues, flushUpdateChildrenDebounce] = useDebounce(handleUpdateChildrenEntries, 1000)

	useEffect(() => {
		if (!journalEntryChildrenQuery.data.length) {
			return
		}
		setChildren(Object.fromEntries(journalEntryChildrenQuery.data.map((entry) => [entry._id, entry])))
	}, [journalEntryChildrenQuery.data])

	useEffect(() => {
		console.log('children changed')
		debouncedhandleSaveChildrenWithCurrentValues()
		return () => {
			flushUpdateChildrenDebounce()
		}
	}, [children])

	console.log('journalEntryChildrenQuery.data', journalEntryChildrenQuery.data)

	// console.log('childrenFieldArray', childrenFieldArray)

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
							<Typography>Sub-Entries (0)</Typography>
							<Button onClick={() => handleAddChildEntry()} startIcon={<Add />}>Add Row</Button>
						</Stack>
						<Stack mt={2} mx={-1} spacing={1}>
							{Object.values(children).map((entry) => {
								return (
									<ChildJournalEntryForm
										key={entry._id}
										entry={entry}
										onChange={handleChangeChildEntry}
										selected={selectedRowsSet.has(entry._id)}
										onSelectedChange={(selected) => {
											setSelectedRowsSet((prev) => {
												const newSet = new Set(prev)
												if (selected) {
													newSet.add(entry._id)
												} else {
													newSet.delete(entry._id)
												}
												return newSet
											})
										}}
									
									/>
								)
							})}
								
						</Stack>
						{/* <Stack>
							{artifactsFieldArray.fields.map((field, index) => {
								return (
									<AttachmentRow
										key={field.id}
										onRemove={() => artifactsFieldArray.remove(index)}
										index={index}
									/>
								)
							})}
						</Stack> */}
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
