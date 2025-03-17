import { KeyboardActionName } from '@/constants/keyboard'
import { JournalEditorDateViewSymbol, JournalEntryContext } from '@/contexts/JournalEntryContext'
import { JournalEntry } from '@/types/schema'
import { dateViewIsAnnualPeriod, dateViewIsMonthlyPeriod, dateViewIsRange, dateViewIsWeeklyPeriod, getAbsoluteDateRangeFromDateView, getAnnualPeriodFromDate, getDateViewSymbol, getEmpiracleDateRangeFromJournalEntries, getMonthlyPeriodFromDate, getWeeklyPeriodFromDate } from '@/utils/date'
import {
	ArrowBack,
	ArrowDropDown,
	ArrowForward,
	CalendarToday,
	CheckBox,
	CheckBoxOutlineBlank,
	IndeterminateCheckBox
} from '@mui/icons-material'
import { Button, IconButton, ListItemText, Menu, MenuItem, Popover, Stack, Tab, Tabs, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material'
import { DateCalendar, DateView, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useCallback, useContext, useMemo, useRef, useState } from 'react'
import KeyboardShortcut from '../text/KeyboardShortcut'

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

const dateViewMenuOptionLabels: Record<JournalEditorDateViewSymbol, string> = {
	[JournalEditorDateViewSymbol.WEEKLY]: 'Week',
	[JournalEditorDateViewSymbol.MONTHLY]: 'Month',
	[JournalEditorDateViewSymbol.YEARLY]: 'Year',
	[JournalEditorDateViewSymbol.RANGE]: 'Date Range',
}

type JournalEditorDateViewSymbolWithKeystroke = Exclude<JournalEditorDateViewSymbol, JournalEditorDateViewSymbol.RANGE>;

const dateViewKeystrokes: Record<JournalEditorDateViewSymbolWithKeystroke, KeyboardActionName> = {
	[JournalEditorDateViewSymbol.WEEKLY]: KeyboardActionName.DATE_VIEW_WEEKLY,
	[JournalEditorDateViewSymbol.MONTHLY]: KeyboardActionName.DATE_VIEW_MONTHLY,
	[JournalEditorDateViewSymbol.YEARLY]: KeyboardActionName.DATE_VIEW_ANNUALLY,
}

// Date range seperator
const SEPERATOR = '\u00A0\u2013\u00A0'

export default function JournalHeader(props: JournalHeaderProps) {
	const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
	const [showDateViewPicker, setShowDateViewPicker] = useState<boolean>(false)
	const [showSelectAllMenu, setShowSelectAllMenu] = useState<boolean>(false)


	const datePickerButtonRef = useRef<HTMLButtonElement | null>(null);
	const dateViewPickerButtonRef = useRef<HTMLButtonElement | null>(null);
	const selectAllMenuButtonRef = useRef<HTMLButtonElement | null>(null);
	// const [journalFiltersAnchorEl, setJournalFiltersAnchorEl] = useState<HTMLButtonElement | null>(null)

	const journalEntryContext = useContext(JournalEntryContext)
	const hideTodayButton = dateViewIsRange(journalEntryContext.dateView)

	const theme = useTheme()
	const hideDateViewPicker = useMediaQuery(theme.breakpoints.down('md'))
	const hideNextPrevButtons = hideTodayButton || hideDateViewPicker
	const headingSize = useMediaQuery(theme.breakpoints.down('sm')) ? 'h6' : 'h5'

	const now = useMemo(() => dayjs(), [])

	const [prevButtonTooltip, nextButtonTooltip] = useMemo(() => {
		if (dateViewIsMonthlyPeriod(journalEntryContext.dateView)) {
			return ['Previous month', 'Next month']
		} else if (dateViewIsAnnualPeriod(journalEntryContext.dateView)) {
			return ['Previous year', 'Next year']
		} else if (dateViewIsWeeklyPeriod(journalEntryContext.dateView)) {
			return ['Previous week', 'Next week']
		} else {
			return [undefined, undefined]
		}
	}, [journalEntryContext.dateView])

	/**
	 * Supported formats include:
	 * 
	 * @example "2024" // Year view
	 * @example "September" // Monthly view, in current year
	 * @example "Dec 2024" // Monthly view, in past/future year
	 * @example "Jan 1 - 7" // Weekly view in current year
	 * @example "Sep 1 - 7, 2022" // Weekly view in past year
	 * @example "Dec 31, 2023 - Jan 6, 2024" // Weekly view spanning multiple past/future years
	 * @example "Jan 30 - Sep 2" // Date range in current year
	 * @example "Jan 5 - Feb 3, 2021" // Date range in past/future year
	 * @example "Nov 2020 - Feb 2021" // Date range spanning multiple years
	 */
	const formattedDateString = useMemo(() => {
		const { dateView } = journalEntryContext
		let { startDate, endDate } = getAbsoluteDateRangeFromDateView(dateView)

		// Handle case where an incomplete range is given
		if (!startDate || !endDate) {
			const journalEntries: JournalEntry[] = Object.values(journalEntryContext.getJournalEntriesQuery.data ?? {})
			const { startDate: empiracleStartDate, endDate: empiracleEndDate } = getEmpiracleDateRangeFromJournalEntries(journalEntries)
			if (empiracleStartDate && empiracleEndDate) {
				startDate = empiracleStartDate
				endDate = empiracleEndDate
			}
			if (!startDate || !endDate) {
				const date = startDate ?? endDate
				if (!date) {
					return dayjs(now).format('MMM D')
				}

				if (dayjs(date).isSame(now, 'year')) {
					return dayjs(date).format('MMM D')
				} else {
					return dayjs(date).format('MMM D, YYYY')
				}
			}
		}

		if (dateViewIsAnnualPeriod(dateView)) {
			return String(dateView.year)
		}

		const spansCurrentYear = startDate.isSame(now, 'year') && endDate.isSame(now, 'year')
		const spansSingleYear = startDate.isSame(endDate, 'year')
		const spansSingleMonth = startDate.isSame(endDate, 'month')

		if (dateViewIsMonthlyPeriod(dateView)) {
			if (spansCurrentYear) {
				return startDate.format('MMMM')
			}
			return startDate.format('MMM YYYY')
		}

		if (spansSingleYear) {
			const endFormat = spansCurrentYear ? 'D' : 'D, YYYY'
			
			if (spansSingleMonth) {
				return [
					startDate.format('MMM D'),
					endDate.format(endFormat),
				].join(SEPERATOR)
			}
			
			return [
				startDate.format('MMM D'),
				endDate.format(`MMM ${endFormat}`)
			].join(SEPERATOR)
		}

		const format = dateViewIsWeeklyPeriod(dateView) ? 'MMM D, YYYY' : 'MMM YYYY'
		return [
			startDate.format(format),
			endDate.format(format),
		].join(SEPERATOR)
	}, [journalEntryContext.dateView, journalEntryContext.getJournalEntriesQuery.data])

	// const calendarAvailableViews = useMemo((): DateView[] => {
	// 	switch (journalEntryContext.view) {
	// 		case 'year':
	// 			return ['year']
	// 		case 'week':
	// 			return ['year', 'month', 'day']
	// 		case 'month':
	// 		default:
	// 			return ['month', 'year']
	// 	}
	// }, [journalEntryContext.view])

	const formattedCurrentDay = useMemo(() => {
		return now.format('dddd, MMMM D')
	}, [])

	const currentDateViewSymbol: JournalEditorDateViewSymbol = useMemo(() => {
		return getDateViewSymbol(journalEntryContext.dateView)
	}, [journalEntryContext.dateView])

	// const handleChangeDatePickerDate = (value: dayjs.Dayjs) => {
	// 	journalEntryContext.setDate(value.format('YYYY-MM-DD'))
	// }

	const handlePrevPage = () => {
		if (dateViewIsRange(journalEntryContext.dateView)) {
			return
		}

		const absoluteDateRange = getAbsoluteDateRangeFromDateView(journalEntryContext.dateView)
		if (!absoluteDateRange.startDate) {
			return
		}

		const currentDate = dayjs(absoluteDateRange.startDate)
		let newDate: dayjs.Dayjs

		if (dateViewIsMonthlyPeriod(journalEntryContext.dateView)) {
			newDate = currentDate.subtract(1, 'month')
			journalEntryContext.onChangeDateView({
				year: newDate.year(),
				month: newDate.month() + 1, // Zero-indexed
			})
		} else if (dateViewIsWeeklyPeriod(journalEntryContext.dateView)) {
			newDate = currentDate.subtract(1, 'week')
			journalEntryContext.onChangeDateView({
				year: newDate.year(),
				month: newDate.month() + 1, // Zero-indexed
				day: newDate.date(),
			})
		} else if (dateViewIsAnnualPeriod(journalEntryContext.dateView)) {
			newDate = currentDate.subtract(1, 'year')
			journalEntryContext.onChangeDateView({
				year: newDate.year()
			})
		}
	}

	const handleNextPage = () => {
		if (dateViewIsRange(journalEntryContext.dateView)) {
			return
		}

		const absoluteDateRange = getAbsoluteDateRangeFromDateView(journalEntryContext.dateView)
		if (!absoluteDateRange.startDate) {
			return
		}

		const currentDate = dayjs(absoluteDateRange.startDate)
		let newDate: dayjs.Dayjs

		if (dateViewIsMonthlyPeriod(journalEntryContext.dateView)) {
			newDate = currentDate.add(1, 'month')
			journalEntryContext.onChangeDateView(getMonthlyPeriodFromDate(newDate))
		} else if (dateViewIsWeeklyPeriod(journalEntryContext.dateView)) {
			newDate = currentDate.add(1, 'week')
			journalEntryContext.onChangeDateView(getWeeklyPeriodFromDate(newDate))
		} else if (dateViewIsAnnualPeriod(journalEntryContext.dateView)) {
			newDate = currentDate.add(1, 'year')
			journalEntryContext.onChangeDateView(getAnnualPeriodFromDate(newDate))
		}
	}

	const jumpToToday = useCallback(() => {
		if (dateViewIsRange(journalEntryContext.dateView)) {
			return
		}

		const newDateView = { ...journalEntryContext.dateView, year: now.year() }

		if (dateViewIsMonthlyPeriod(newDateView)) {
			newDateView.month = now.month() + 1 // Zero-indexed
		} else if (dateViewIsWeeklyPeriod(newDateView)) {
			newDateView.month = now.month() + 1 // Zero-indexed
			newDateView.day = now.date()
		} else if (!dateViewIsAnnualPeriod(newDateView)) {
			return
		}

		journalEntryContext.onChangeDateView(newDateView)
	}, [journalEntryContext.dateView])

	const handleSelectAll = (action: SelectAllAction) => {
		setShowSelectAllMenu(false)
		props.onSelectAll(action)
	}

	const handleChangeDateView = (view: JournalEditorDateViewSymbol) => {
		setShowDateViewPicker(false)
		journalEntryContext.switchDateView(view)
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
			<Menu
				open={showDateViewPicker}
				anchorEl={dateViewPickerButtonRef.current}
				onClose={() => setShowDateViewPicker(false)}
			>
				{Object.entries(dateViewMenuOptionLabels)
					.filter(([key]) => {
						return !(key === JournalEditorDateViewSymbol.RANGE && !(currentDateViewSymbol === key))
					})
					.map(([key, label]) => {
						return (
							<MenuItem
								key={key}
								onClick={() => handleChangeDateView(key as JournalEditorDateViewSymbol)}
								aria-label={`View by ${label}`}
								selected={key === currentDateViewSymbol}
							>
								<ListItemText>{label}</ListItemText>
								{dateViewKeystrokes[key as JournalEditorDateViewSymbolWithKeystroke] && (
									<KeyboardShortcut
										name={dateViewKeystrokes[key as JournalEditorDateViewSymbolWithKeystroke]}
										sx={{ ml: 2 }}
									/>
								)}
							</MenuItem>
						)
					})}
			</Menu>
			<Popover open={showDatePicker} onClose={() => setShowDatePicker(false)} anchorEl={datePickerButtonRef.current}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DateCalendar
						// views={calendarAvailableViews}
						onChange={(value) => {
							// handleChangeDatePickerDate(value)
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
						{/* TODO to be implemented by ZK-112 */}
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
							{!hideDateViewPicker && (
								<Button
									variant='outlined'
									sx={(theme) => ({
										borderRadius: theme.spacing(8)
									})}
									ref={dateViewPickerButtonRef}
									onClick={() => setShowDateViewPicker((showing) => !showing)}
									color="inherit"
									endIcon={<ArrowDropDown />}
								>
									<Typography>
										{dateViewMenuOptionLabels[currentDateViewSymbol]}
									</Typography>
								</Button>
							)}
							{!hideTodayButton && (
								<Tooltip title={formattedCurrentDay}>
									<IconButton color="inherit" onClick={() => jumpToToday()}>
										<CalendarToday />
									</IconButton>
								</Tooltip>
							)}
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
										<IconButton onClick={() => handlePrevPage()}>
											<ArrowBack />
										</IconButton>
									</Tooltip>
									<Tooltip title={nextButtonTooltip}>
										<IconButton onClick={() => handleNextPage()}>
											<ArrowForward />
										</IconButton>
									</Tooltip>
								</Stack>
							)}
						</Stack>
					</Stack>
				</Stack>
				{/* TODO To be implemented in ZK-111 */}
				<Tabs value='JOURNAL'>
					<Tab value='JOURNAL' label='Journal Entries' />
					<Tab value='TRANSFERS' label='Account Transfers' disabled />
					<Tab value='ANALYSIS' label='Analysis' disabled />
				</Tabs>
			</Stack>
		</>
	)
}
