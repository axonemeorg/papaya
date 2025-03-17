import JournalEditor from '@/components/journal/JournalEditor'
import { JournalEditorDateViewSymbol } from '@/contexts/JournalEntryContext'
import { getLayout } from '@/layouts/main'
import JournalEntryContextProvider from '@/providers/JournalEntryContextProvider'
import { DatePeriod, DateView, MonthlyPeriod, WeeklyPeriod } from '@/types/schema'
import { dateMonthNumberWithLeadingZero, getAbsoluteDateRangeFromDateView, getAnnualPeriodFromDate, getMonthlyPeriodFromDate, getWeeklyPeriodFromDate } from '@/utils/date'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo } from 'react'

const JournalYearMonthPage = () => {
	const router = useRouter()

	const viewParams: string[] = (router.query.view as string[]) ?? []
	const view = viewParams[0] as JournalEditorDateViewSymbol ?? JournalEditorDateViewSymbol.MONTHLY

	const now = useMemo(() => dayjs(), [])

	const pushToRouter = (view: JournalEditorDateViewSymbol, year: string, month: string, day: string) => {
		const routerParts = [
			'',
			...[
				'journal',
				view,
				...[year, month, day]
					.filter(Boolean)
					
					// Removes leading zeroes
					.map((x) => String(Number(x)))
			]
		]
		router.push(routerParts.join('/'))
	}

	const handleDateChange = useCallback(
		(newDate: string) => {
			let [y, m, d] = newDate.split('-')
			if (view === JournalEditorDateViewSymbol.YEARLY || view === JournalEditorDateViewSymbol.MONTHLY) {
				d = ''
			}
			if (view === JournalEditorDateViewSymbol.YEARLY) {
				m = ''
			}

			pushToRouter(view, y, m, d)
		},
		[view]
	)

	const date = useMemo(() => {
		const year: number = viewParams[1] ? Number(viewParams[1]) : now.year()
		let month: number

		if (viewParams[2]) {
			month = Number(viewParams[2])
		} else if (viewParams[1]) {
			month = 1
		} else {
			month = now.month() + 1 // Zero-indexed
		}

		const isSameMonthAndYear = year === now.year() && month === now.month() + 1 // Zero-indexed
		let day: number

		if (viewParams[3]) {
			day = Number(viewParams[3])
		} else if (isSameMonthAndYear) {
			day = now.date()
		} else {
			day = 1
		}

		return [
			year,
			dateMonthNumberWithLeadingZero(month),
			dateMonthNumberWithLeadingZero(day),
		].join('-')
	}, [viewParams])

	useEffect(() => {
		if (!viewParams.length) {
			return
		}
		if (
			(view === JournalEditorDateViewSymbol.YEARLY && viewParams.length !== 2) ||
			(view === JournalEditorDateViewSymbol.MONTHLY && viewParams.length !== 3) ||
			(view === JournalEditorDateViewSymbol.WEEKLY && viewParams.length !== 4)
		) {
			// Rewrite the URL to include only the necessary parts
			handleDateChange(date)
		}
	}, [viewParams])

	const handleChangeDateView = (dateView: DateView) => {
		const { startDate } = getAbsoluteDateRangeFromDateView(dateView)
		if (!startDate) {
			return
		}
		handleDateChange(startDate.format('YYYY-MM-DD'))
	}

	const handleSwitchDateView = (newView: JournalEditorDateViewSymbol) => {
		if (newView === view || newView === JournalEditorDateViewSymbol.RANGE) {
			return
		}

		let datePeriod: DatePeriod | undefined = undefined
		switch (newView) {
			case JournalEditorDateViewSymbol.YEARLY:
				datePeriod = getAnnualPeriodFromDate(dayjs(date))
				break

			case JournalEditorDateViewSymbol.MONTHLY:
				datePeriod = getMonthlyPeriodFromDate(dayjs(date))
				break

			case JournalEditorDateViewSymbol.WEEKLY:
				datePeriod = getWeeklyPeriodFromDate(dayjs(date))
				break
		}

		if (!datePeriod) {
			return
		}

		const { year, month, day } = (datePeriod as WeeklyPeriod)

		console.log('spread:', { year, month, day })

		pushToRouter(
			newView,
			year ? String(year) : '',
			month ? String(month) : '',
			day ? String(day) : '',
		)
		
	}

	const dateView = useMemo((): DateView => {
		if (view === JournalEditorDateViewSymbol.RANGE) {
			// TODO startDate and endDate to be (ostensibly) pulled from query params
			return {}
		}
		const value: DateView = {
			year: dayjs(date).year()
		}
		if (view === JournalEditorDateViewSymbol.WEEKLY || view === JournalEditorDateViewSymbol.MONTHLY) {
			(value as MonthlyPeriod).month = dayjs(date).month() + 1 // Zero-indexed
		}
		if (view === JournalEditorDateViewSymbol.WEEKLY) {
			(value as WeeklyPeriod).day = dayjs(date).date()
		}

		return value
	}, [date, view])

	return (
		<JournalEntryContextProvider
			dateView={dateView}
			onChangeDateView={handleChangeDateView}
			switchDateView={handleSwitchDateView}
		>
			<JournalEditor />
		</JournalEntryContextProvider>
	)
}

JournalYearMonthPage.getLayout = getLayout

export default JournalYearMonthPage
