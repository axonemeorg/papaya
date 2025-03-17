import { JournalEntry } from '@/types/schema'
import { dateViewIsAnnualPeriod, dateViewIsMonthlyPeriod, dateViewIsRange, dateViewIsWeeklyPeriod, getAbsoluteDateRangeFromDateView, getAnnualPeriodFromDate, getDateViewSymbol, getEmpiracleDateRangeFromJournalEntries, getMonthlyPeriodFromDate, getWeeklyPeriodFromDate } from '@/utils/date'
import {
	Add,
	ArrowBack,
	ArrowDropDown,
	ArrowForward,
	CalendarToday,
	CheckBox,
	CheckBoxOutlineBlank,
	Delete,
	Filter,
	FilterAlt,
	FilterAltOff,
	IndeterminateCheckBox,
	MoreVert
} from '@mui/icons-material'
import { Button, IconButton, ListItemText, Menu, MenuItem, Popover, Stack, Tab, Tabs, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material'
import { DateCalendar, DateView, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useCallback, useContext, useMemo, useRef, useState } from 'react'
import KeyboardShortcut from '../../text/KeyboardShortcut'
import useKeyboardAction from '@/hooks/useKeyboardAction'
import { JournalSliceContext } from '@/contexts/JournalSliceContext'

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

	const journalSliceContext = useContext(JournalSliceContext)
	const numSelectedRows = Object.values(journalSliceContext.selectedRows).filter(Boolean).length

	const hideSelectedRowsOptions = numSelectedRows <= 0


	const handleSelectAll = (action: SelectAllAction) => {
		setShowSelectAllMenu(false)
		journalSliceContext.onSelectAll(action)
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
						<MenuItem key={key} onClick={() => handleSelectAll(key as SelectAllAction)} aria-label={`Select ${label}`}>
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
						onClick={() => journalSliceContext.onSelectAll(SelectAllAction.TOGGLE)}
						ref={selectAllMenuButtonRef}
						disabled={journalSliceContext.numRows === 0}
					>
						{(journalSliceContext.numRows === numSelectedRows) && journalSliceContext.numRows > 0 ? (
							<CheckBox color='primary' />
						) : <>
							{(numSelectedRows < journalSliceContext.numRows) && numSelectedRows > 0 ? (
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
						disabled={journalSliceContext.numRows === 0}
					>
						<ArrowDropDown />
					</Button>
				</Stack>
				{!hideSelectedRowsOptions && (
					<>
						<IconButton>
							<Delete fontSize='small' />
						</IconButton>
					</>
				)}
				<IconButton>
					<MoreVert fontSize='small' />
				</IconButton>
			</Stack>
		</>
    )
}
