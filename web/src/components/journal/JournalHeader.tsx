import { JournalEntryContext } from '@/contexts/JournalEntryContext'
import { ArrowBack, ArrowDropDown, ArrowForward, EventRepeat, FilterList } from '@mui/icons-material'
import { Button, IconButton, Popover, Stack, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material'
import { DateCalendar, DateView, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react'
import JournalFilters from './JournalFilters'

type JournalHeaderProps = PropsWithChildren<{
	reverseActionOrder?: boolean
	numRows?: number
	numSelectedRows?: number
	toggleSelectAllRows?: () => void
}>

export default function JournalHeader(props: JournalHeaderProps) {
	const [datePickerAnchorEl, setDatePickerAnchorEl] = useState<HTMLButtonElement | null>(null)
	const [journalFiltersAnchorEl, setJournalFiltersAnchorEl] = useState<HTMLButtonElement | null>(null)

	const journalEntryContext = useContext(JournalEntryContext)

	const handleChangeDatePickerDate = (value: dayjs.Dayjs) => {
		journalEntryContext.setDate(value.format('YYYY-MM-DD'))
	}

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

	const jumpToToday = useCallback(() => {
		journalEntryContext.setDate(now.format('YYYY-MM-DD'))
	}, [journalEntryContext.view])

	return (
		<>
			<Popover open={Boolean(datePickerAnchorEl)} onClose={() => setDatePickerAnchorEl(null)} anchorEl={datePickerAnchorEl}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DateCalendar
						views={calendarAvailableViews}
						onChange={(value) => {
							handleChangeDatePickerDate(value)
						}}
					/>
				</LocalizationProvider>
			</Popover>
			<Stack
				component="header"
				direction="row"
				justifyContent="space-between"
				sx={{ flex: 0, py: 1, px: 2 }}
				alignItems="center"
				flexDirection={props.reverseActionOrder ? 'row-reverse' : 'row'}
				gap={1}>
				<Stack direction="row" alignItems="center" gap={2}>
					{props.children}
				</Stack>
				<Stack
					direction="row"
					alignItems="center"
					gap={2}
					flexDirection={props.reverseActionOrder ? 'row-reverse' : 'row'}
				>
					<Button
						startIcon={<FilterList />}
						color='inherit'
						variant='outlined'
						onClick={(event) => setJournalFiltersAnchorEl(event.currentTarget)}
					>
						Filters
					</Button>
					<JournalFilters
						anchorEl={journalFiltersAnchorEl}
						onClose={() => setJournalFiltersAnchorEl(null)}
						filterConfig={{
							maxTransactionAmount: 1000,
							minTransactionAmount: 0
						}}
					/>
					{!hideTodayButton && (
						<Tooltip title={formattedCurrentDay}>
							<IconButton color="inherit" onClick={() => jumpToToday()}>
								<EventRepeat />
							</IconButton>
						</Tooltip>
					)}
					<Stack direction="row" alignItems="center" gap={1}>
						<Button
							color="inherit"
							endIcon={<ArrowDropDown />}
							onClick={(e) => setDatePickerAnchorEl(e.currentTarget)}>
							<Typography
								variant={headingSize}
								sx={{ fontWeight: 500, minWidth: '9ch', textAlign: 'left' }}>
								{formattedDateString}
							</Typography>
						</Button>
						{!hideNextPrevButtons && (
							<Stack direction="row">
								<Tooltip title={prevButtonTooltip}>
									<IconButton size="small" onClick={() => journalEntryContext.onPrevPage()}>
										<ArrowBack />
									</IconButton>
								</Tooltip>
								<Tooltip title={nextButtonTooltip}>
									<IconButton size="small" onClick={() => journalEntryContext.onNextPage()}>
										<ArrowForward />
									</IconButton>
								</Tooltip>
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		</>
	)
}
