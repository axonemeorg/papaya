'use client'

import { Autocomplete, AutocompleteProps } from '@mui/material'

import { useContext } from 'react'
import { JournalContext } from '@/contexts/JournalContext'

export type CategoryAutocompleteProps = Omit<AutocompleteProps<string, true, false, false>, 'options'>

export default function CategoryAutocomplete(props: CategoryAutocompleteProps) {
	const { loading, ...rest } = props

	const { getCategoriesQuery } = useContext(JournalContext)
	const { data, isLoading } = getCategoriesQuery

	return (
		<Autocomplete
			{...rest}
			loading={isLoading || loading}
			options={Object.keys(data)}
		/>
	)
}
