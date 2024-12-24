'use client'

import { Autocomplete, AutocompleteProps, ListItem, ListItemText, TextField } from '@mui/material'

import { useContext } from 'react'
import { JournalContext } from '@/contexts/JournalContext'
import { RESERVED_TAGS } from '@/constants/tags'
import { EntryTag, ReservedTag } from '@/types/schema'

export type EntryTagAutocompleteProps = Partial<Omit<AutocompleteProps<string, true, false, false>, 'options'>>

export default function EntryTagAutocomplete(props: EntryTagAutocompleteProps) {
	const { loading, ...rest } = props

	const { getEntryTagsQuery } = useContext(JournalContext)
	const { data, isLoading } = getEntryTagsQuery

	const options: Record<string, EntryTag | ReservedTag> = {
		...RESERVED_TAGS,
		...data,
	}

	return (
		<Autocomplete
			loading={isLoading || loading}
			options={[...Object.keys(RESERVED_TAGS), ...Object.keys(data)]}
			renderInput={(params) => <TextField {...params} label={'Tag'} />}
			getOptionLabel={(option) => data[option]?.label}
			renderOption={(props, option) => {
				const { key, ...optionProps } = props
				const entryTag: EntryTag | ReservedTag = options[option]

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
