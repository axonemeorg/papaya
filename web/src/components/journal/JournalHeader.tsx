import { JournalEntryContext } from '@/contexts/JournalEntryContext'
import {
	ArrowBack,
	ArrowDropDown,
	ArrowForward,
	CalendarToday,
	CheckBox,
	CheckBoxOutlineBlank,
	IndeterminateCheckBox
} from '@mui/icons-material'
import { Button, IconButton, Menu, MenuItem, Popover, Stack, Tab, Tabs, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material'
import { DateCalendar, DateView, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useCallback, useContext, useMemo, useRef, useState } from 'react'
import JournalFilters from './JournalFilters'

interface JournalHeaderProps {
	numRows: number
	numSelectedRows: number
	onSelectAll: (action: SelectAllAction) => void
}

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

export default function JournalHeader(props: JournalHeaderProps) {
	const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
	const datePickerButtonRef = useRef<HTMLButtonElement | null>(null);
	const [showSelectAllMenu, setShowSelectAllMenu] = useState<boolean>(false)
	const selectAllMenuButtonRef = useRef<HTMLButtonElement | null>(null);
	// const [journalFiltersAnchorEl, setJournalFiltersAnchorEl] = useState<HTMLButtonElement | null>(null)

	const journalEntryContext = useContext(JournalEntryContext)

	const theme = useTheme()
	const hideTodayButton = journalEntryContext.view === 'all'
	const hideNextPrevButtons = hideTodayButton || useMediaQuery(theme.breakpoints.down('md'))
	const headingSize = useMediaQuery(theme.breakpoints.down('sm')) ? 'h6' : 'h5'

	const now = useMemo(() => dayjs(), [])

	const nextButtonTooltip = useMemo(() => {
		if (journalEntryContext.view === 'month') {
			return 'Next month'
		}
		if (journalEntryContext.view === 'year') {
			return 'Next year'
		}
		if (journalEntryContext.view === 'week') {
			return 'Next week'
		}
	}, [journalEntryContext.view])

	const prevButtonTooltip = useMemo(() => {
		if (journalEntryContext.view === 'month') {
			return 'Previous month'
		}
		if (journalEntryContext.view === 'year') {
			return 'Previous year'
		}
		if (journalEntryContext.view === 'week') {
			return 'Previous week'
		}
	}, [journalEntryContext.view])

	const formattedDateString = useMemo(() => {
		const date = dayjs(journalEntryContext.date)
		let isCurrentYear
		let startOfWeek
		let endOfWeek

		switch (journalEntryContext.view) {
			case 'all':
				// TODO: Implement all time view to show the timestamp range from the first entry to today/the last entry
				return 'All Time'
			case 'month':
				isCurrentYear = date.isSame(now, 'year')
				if (isCurrentYear) {
					return date.format('MMMM')
				}

				return date.format('MMM YYYY')
			case 'year':
				return date.format('YYYY')
			case 'week':
			default:
				startOfWeek = date.startOf('week')
				endOfWeek = date.endOf('week')
				// Format into form "Jan 1 - 7, 2022"
				return `${startOfWeek.format('MMM D')} - ${endOfWeek.format('D, YYYY')}`
		}
	}, [journalEntryContext.date, journalEntryContext.view])

	const calendarAvailableViews = useMemo((): DateView[] => {
		switch (journalEntryContext.view) {
			case 'month':
			default:
				return ['month', 'year']
			case 'year':
				return ['year']
			case 'week':
				return ['year', 'month', 'day']
		}
	}, [journalEntryContext.view])

	const formattedCurrentDay = useMemo(() => {
		return now.format('dddd, MMMM D')
	}, [])

	const handleChangeDatePickerDate = (value: dayjs.Dayjs) => {
		journalEntryContext.setDate(value.format('YYYY-MM-DD'))
	}

	const jumpToToday = useCallback(() => {
		journalEntryContext.setDate(now.format('YYYY-MM-DD'))
	}, [journalEntryContext.view])

	const handleSelectAll = (key: SelectAllAction) => {
		setShowSelectAllMenu(false)
		props.onSelectAll(key)
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
							{label}
						</MenuItem>
					)
				})}
			</Menu>
			<Popover open={showDatePicker} onClose={() => setShowDatePicker(false)} anchorEl={datePickerButtonRef.current}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DateCalendar
						views={calendarAvailableViews}
						onChange={(value) => {
							handleChangeDatePickerDate(value)
						}}
					/>
				</LocalizationProvider>
			</Popover>
			<Stack component='header'>
				<Stack
					direction="row"
					justifyContent="space-between"
					sx={{ flex: 0, py: 1, px: 2, pb: 0 }}
					alignItems="center"
					gap={1}
				>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent='space-between'
						sx={{ width: '100%' }}
						gap={2}
					>
						{/* <JournalFilters
							anchorEl={journalFiltersAnchorEl}
							onClose={() => setJournalFiltersAnchorEl(null)}
							filterConfig={{
								maxTransactionAmount: 1000,
								minTransactionAmount: 0
							}}
						/> */}
						<Stack direction="row" alignItems="center" gap={1}>
							<Stack direction='row'>
								<Button
									sx={{ minWidth: 'unset', pr: 0.5, ml: -1 }}
									color='inherit'
									onClick={() => props.onSelectAll(SelectAllAction.TOGGLE)}
									ref={selectAllMenuButtonRef}
								>
									{props.numRows === props.numSelectedRows ? (
										<CheckBox color='primary' />
									) : <>
										{(props.numSelectedRows < props.numRows) && props.numSelectedRows > 0 ? (
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
								>
									<ArrowDropDown />
								</Button>
							</Stack>
						</Stack>
						<Stack direction="row" alignItems="center" gap={1}>
							<Button
								color="inherit"
								endIcon={<ArrowDropDown />}
								ref={datePickerButtonRef}
								onClick={() => setShowDatePicker((showing) => !showing)}>
								<Typography
									variant={headingSize}
									sx={{ fontWeight: 500 }}>
									{formattedDateString}
								</Typography>
							</Button>
							{!hideNextPrevButtons && (
								<Stack direction="row">
									<Tooltip title={prevButtonTooltip}>
										<IconButton onClick={() => journalEntryContext.onPrevPage()}>
											<ArrowBack />
										</IconButton>
									</Tooltip>
									<Tooltip title={nextButtonTooltip}>
										<IconButton onClick={() => journalEntryContext.onNextPage()}>
											<ArrowForward />
										</IconButton>
									</Tooltip>
								</Stack>
							)}
							{!hideTodayButton && (
								<Tooltip title={formattedCurrentDay}>
									<IconButton color="inherit" onClick={() => jumpToToday()}>
										<CalendarToday />
									</IconButton>
								</Tooltip>
							)}
						</Stack>
					</Stack>
				</Stack>
				<Tabs value='JOURNAL'>
					<Tab value='JOURNAL' label='Journal Entries' />
					<Tab value='TRANSFERS' label='Account Transfers' />
				</Tabs>
			</Stack>
		</>
	)
}
