'use client'

import { Grid2 as Grid, TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { Category, CreateQuickJournalEntry } from '@/types/schema'
import CategoryAutocomplete from '../input/CategoryAutocomplete'
import AmountField from '../input/AmountField'

export default function QuickJournalEntryForm() {
	// const [manuallySetCategory, setManuallySetCategory] = useState<boolean>(false);
	// const enableAutoDetectCategory = true;

	const { watch, control, setValue } = useFormContext<CreateQuickJournalEntry>()

	// const handleDetectCategoryWithAi = debounce(async (memo) => {
	//     if (memo.length < 2) {
	//         return
	//     }

	//     const category = await findMostSimilarUserCategory(memo);
	//     setValue('category', category);
	// }, 500)

	return (
		<Grid container columns={12} spacing={2}>
			<Grid size={3}>
				<Controller
					control={control}
					name="memo"
					render={({ field }) => (
						<TextField
							label="Memo"
							autoFocus
							{...field}
							ref={null}
							value={field.value}
							onChange={(event) => {
								const value = event.target.value
								setValue(field.name, value)
								// if (!manuallySetCategory && enableAutoDetectCategory) {
								//     handleDetectCategoryWithAi(value);
								// }
							}}
							fullWidth
							size="small"
						/>
					)}
				/>
			</Grid>
			<Grid size={3}>
				<Controller
					control={control}
					name={`amount`}
					render={({ field }) => (
						<AmountField
							label="Amount"
							{...field}
							fullWidth
							size="small"
						/>
					)}
				/>
			</Grid>
			<Grid size={5}>
				<Controller
					control={control}
					name="categoryIds"
					render={({ field }) => {
						const categoryIds = watch('categoryIds')
						const categoryId: Category['_id'] | null = categoryIds?.length > 0 ? categoryIds[0] : null

						return (
							<CategoryAutocomplete
								{...field}
								ref={null}
								value={categoryId}
								onChange={(_event, newValue) => {
									// setManuallySetCategory(Boolean(newValue))
									setValue(field.name, newValue ? [newValue] : [])
								}}
								size="small"
							/>
						)
					}}
				/>
			</Grid>
		</Grid>
	)
}
