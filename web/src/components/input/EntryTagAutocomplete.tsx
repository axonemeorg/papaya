'use client'

import { Autocomplete, AutocompleteProps, ListItem, ListItemText, TextField } from '@mui/material'

import { useContext } from 'react'
import { JournalContext } from '@/contexts/JournalContext'

export type EntryTagAutocompleteProps = Partial<Omit<AutocompleteProps<string, true, false, false>, 'options'>>

export default function EntryTagAutocomplete(props: EntryTagAutocompleteProps) {
	const { loading, ...rest } = props

	const { getEntryTagsQuery } = useContext(JournalContext)
	const { data, isLoading } = getEntryTagsQuery

	return (
		<Autocomplete
			loading={isLoading || loading}
			options={Object.keys(data)}
			renderInput={(params) => <TextField {...params} label={'Tag'} />}
			getOptionLabel={(option) => data[option]?.label}
			renderOption={(props, option) => {
				const { key, ...optionProps } = props
				const entryTag = data[option]

				return (
					<ListItem dense key={key} {...optionProps}>
						<ListItemText primary={entryTag?.label} secondary={entryTag?.description} />
					</ListItem>
				)
			}}
			{...rest}
			multiple
		/>
	)
}
