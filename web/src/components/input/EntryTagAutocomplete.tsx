'use client'

import { Autocomplete, AutocompleteProps, ListItem, ListItemText, TextField } from '@mui/material'
import { Close, Done } from "@mui/icons-material";

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
			getOptionLabel={(option) => options[option]?.label}
			renderOption={(props, option, { selected }) => {
				const { key, ...optionProps } = props
				const entryTag: EntryTag | ReservedTag | undefined = options[option]

				return (
					<ListItem key={key} {...optionProps}>
						<Done
							sx={(theme) => ({
								width: 17,
								height: 17,
								mr: theme.spacing(1),
								visibility: selected ? 'visible' : 'hidden',
							})}
						/>
						<ListItemText
							primary={entryTag?.label}
							secondary={entryTag?.description}
						/>
						<Close
							sx={{
								opacity: 0.6,
								width: 18,
								height: 18,
								visibility: selected ? 'visible' : 'hidden',
							}}
						/>
					</ListItem>
				);
			}}
			{...rest}
			multiple
		/>
	)
}
