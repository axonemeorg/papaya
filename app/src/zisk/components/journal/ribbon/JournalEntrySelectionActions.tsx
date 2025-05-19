import { useFilteredJournalEntries } from '@/hooks/queries/useFilteredJournalEntries'
import { JournalEntry } from '@/schema/documents/JournalEntry'
import { useJournalEntrySelectionState } from '@/store/app/useJournalEntrySelectionState'
import {
	ArrowDropDown,
	CheckBox,
	CheckBoxOutlineBlank,
	Delete,
	IndeterminateCheckBox,
	MoreVert
} from '@mui/icons-material'
import { Button, Fade, IconButton, ListItemText, Menu, MenuItem, Stack } from '@mui/material'
import { useContext, useRef, useState } from 'react'

export enum SelectAllAction {
	TOGGLE = 'TOGGLE',
	ALL = 'ALL',
	NONE = 'NONE',
	DEBIT = 'DEBIT',
	CREDIT = 'CREDIT',
}

const selectAllMenuOptionLabels: Omit<Record<SelectAllAction, string>, 'TOGGLE'> = {
	[SelectAllAction.ALL]: 'All',
	[SelectAllAction.NONE]: 'None',
	[SelectAllAction.CREDIT]: 'Credits',
	[SelectAllAction.DEBIT]: 'Debits',
}

export default function JournalEntrySelectionActions() {
	const [showSelectAllMenu, setShowSelectAllMenu] = useState<boolean>(false)

	const selectAllMenuButtonRef = useRef<HTMLButtonElement | null>(null);

	const selectedRows = useJournalEntrySelectionState((state) => state.selected)

	const setSelectedRows = useJournalEntrySelectionState((state) => state.setSelected)

	const getFilterJournalEntriesQuery = useFilteredJournalEntries()

	const journalEntries: JournalEntry[] = Object.values(getFilterJournalEntriesQuery.data)
	const numTotalRows = journalEntries.length

	const selectedRowIds = Object.entries(selectedRows)
		.filter(([, value]) => value)
		.map(([key]) => key)

	const hasSelectedAll = journalEntries.every((entry) => selectedRows[entry._id])

	const numSelectedRows = selectedRowIds.length
	const hideSelectedRowsOptions = numSelectedRows <= 0

	const handleSelectAllAction = (action: SelectAllAction) => {
		throw new Error("Not implemented")
		setShowSelectAllMenu(false)
		setSelectedRows(Object.fromEntries(
			journalEntries.map((entry) => [entry._id, true])
		))
	}

  return (
		<>
			<Menu
				open={showSelectAllMenu}
				anchorEl={selectAllMenuButtonRef.current}
				onClose={() => setShowSelectAllMenu(false)}
			>
				{Object.entries(selectAllMenuOptionLabels).map(([key, label]) => {
					return (
						<MenuItem key={key} onClick={() => handleSelectAllAction(key as SelectAllAction)} aria-label={`Select ${label}`}>
							<ListItemText>{label}</ListItemText>
						</MenuItem>
					)
				})}
			</Menu>
			<Stack direction="row" alignItems="center" gap={0}>
				<Stack direction='row'>
					<Button
						sx={{ minWidth: 'unset', pr: 0.5, ml: -1 }}
						color='inherit'
						onClick={() => handleSelectAllAction(SelectAllAction.TOGGLE)}
						ref={selectAllMenuButtonRef}
						disabled={numTotalRows === 0}
					>
						{(hasSelectedAll) && numTotalRows > 0 ? (
							<CheckBox color='primary' />
						) : <>
							{numSelectedRows > 0 ? (
								<IndeterminateCheckBox color='inherit' />	
							) : (
								<CheckBoxOutlineBlank color='inherit' />
							)}
						</>}
					</Button>
					<Button
						color='inherit'
						onClick={() => setShowSelectAllMenu(true)}
						sx={{
							minWidth: 'unset',
							px: 0,
							ml: -0.5
						}}
						disabled={numTotalRows === 0}
					>
						<ArrowDropDown />
					</Button>
				</Stack>
				{!hideSelectedRowsOptions && (
					<Fade in>
						<Stack direction='row' alignItems='center'>
							<IconButton>
								<Delete fontSize='small' />
							</IconButton>
						</Stack>
					</Fade>
				)}
				<IconButton>
					<MoreVert fontSize='small' />
				</IconButton>
			</Stack>
		</>
    )
}
