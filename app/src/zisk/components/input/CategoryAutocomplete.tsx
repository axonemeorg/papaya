'use client'

import { Autocomplete, AutocompleteProps, ListItem, ListItemIcon, ListItemText, TextField } from '@mui/material'

import { useContext } from 'react'
import { JournalContext } from '@/contexts/JournalContext'
import AvatarIcon from '../icon/AvatarIcon'

export type CategoryAutocompleteProps = Partial<Omit<AutocompleteProps<string, true, false, false>, 'options'>>

export default function CategoryAutocomplete(props: CategoryAutocompleteProps) {
	const { loading, ...rest } = props

	const { getCategoriesQuery } = useContext(JournalContext)
	const { data, isLoading } = getCategoriesQuery

	return (
		<Autocomplete
			loading={isLoading || loading}
			options={Object.keys(data)}
			multiple
			renderInput={(params) => <TextField {...params} label={'Category'} />}
			getOptionLabel={(option) => data[option]?.label}
			renderOption={(props, option) => {
				const { key, ...optionProps } = props
				const category = data[option]

				return (
					<ListItem dense key={key} {...optionProps}>
						<ListItemIcon>
							<AvatarIcon avatar={category?.avatar} />
						</ListItemIcon>
						<ListItemText primary={category?.label} />
					</ListItem>
				)
			}}
			{...rest}
		/>
	)
}
