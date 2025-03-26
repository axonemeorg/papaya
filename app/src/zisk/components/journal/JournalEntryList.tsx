import {
	alpha,
	Avatar,
	Button,
	Chip,
	Stack,
	Table,
	TableBody as MuiTableBody,
	TableCell as MuiTableCell,
	TableRow as MuiTableRow,
	Typography,
	useMediaQuery,
	useTheme,
	TableRowProps,
	TableCellProps,
	TableBodyProps,
	Grow,
	Checkbox,
} from '@mui/material'
import { useContext, useMemo } from 'react'

import { Account, Category, EntryTask, JournalEntry, TransferEntry } from '@/types/schema'
import dayjs from 'dayjs'
import AvatarIcon from '@/components/icon/AvatarIcon'
import { getPriceString } from '@/utils/string'
import AvatarChip from '../icon/AvatarChip'
import QuickJournalEditor from './QuickJournalEditor'
import { Flag, LocalOffer } from '@mui/icons-material'
import { JournalContext } from '@/contexts/JournalContext'
import { PLACEHOLDER_UNNAMED_JOURNAL_ENTRY_MEMO } from '@/constants/journal'
import { calculateNetAmount, journalEntryHasTags, journalEntryHasTasks, journalEntryIsFlagged } from '@/utils/journal'
import { useGetPriceStyle } from '@/hooks/useGetPriceStyle'
import { JournalSliceContext } from '@/contexts/JournalSliceContext'
import clsx from 'clsx'
import { dateViewIsMonthlyPeriod, sortDatesChronologically } from '@/utils/date'
import CircularProgressWithLabel from '../icon/CircularProgressWithLabel'

interface JournalTableRowProps extends TableRowProps {
	dateRow?: boolean
	buttonRow?: boolean
}

const TableRow = ({ sx, dateRow, selected, buttonRow, ...rest }: JournalTableRowProps) => {
	const hoverStyles = {
		'.checkbox': { visibility: 'visible' },
		'.icon': { visibility: 'hidden' },
	};

	return (
		<MuiTableRow
			selected={selected}
			hover={!dateRow && !buttonRow}
			sx={{
				'.checkbox': {
					visibility: 'hidden',
				},
				'.icon': {
					visibility: 'visible',
					pointerEvents: 'none',
				},
				'& td': {
					...(dateRow || buttonRow ? {
						cursor: 'default',
					} : {}),
					...(dateRow ? {
						width: '0%',
					} : {})
				},
				...(selected ? hoverStyles : {}),
				'&:hover': hoverStyles,
				userSelect: 'none',
				cursor: 'pointer',
				...sx,
			}}
			{...rest}
		/>
	);
};

interface JournalTableCellProps extends Omit<TableCellProps, 'colSpan'> {
	selectCheckbox?: boolean
	colSpan?: string | number
}

const TableCell = (props: JournalTableCellProps) => {
	const { sx, className, colSpan, selectCheckbox, ...rest } = props

	return (
		<MuiTableCell
			{...rest}
			colSpan={colSpan as number}
			className={clsx(
				className,
				{
					'--selectCheckbox': selectCheckbox,
				}
			)}
			sx={{
				border: 0,
				alignItems: 'center',
				px: 1,
				'&.--selectCheckbox': {
					borderTopLeftRadius: '64px',
					borderBottomLeftRadius: '64px',
					overflow: 'hidden',
					position: 'relative',

					'&::after': {
						position: 'absolute',
						inset: 0,
						borderBottomWidth: '1px',
						borderBottomStyle: 'solid',
						borderImage: `linear-gradient(
							to right,
							rgba(0,0,0,0),
							red
						) 1 100%
						`,
					},
				},
				...sx,
			}}
		/>
	)
}

type JournalTableBodyProps = TableBodyProps

const TableBody = (props: JournalTableBodyProps) => {
	const { sx, ...rest } = props

	return (
		<MuiTableBody
			{...rest}
			sx={(theme) => ({
				borderBottom: `1px solid ${theme.palette.divider}`,
				'&::before, &::after': {
					content: `""`,
					display: 'table-row',
					height: theme.spacing(1)
				},
				...sx as any
			})}
		/>
	)
}

interface JournalEntryDateProps {
	day: dayjs.Dayjs
	isToday: boolean
	onClick?: () => void
}

const JournalEntryDate = (props: JournalEntryDateProps) => {
	const { day, isToday, onClick } = props
	// const theme = useTheme();
	// const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<Stack
			component={Button}
			onClick={onClick}
			direction="row"
			alignItems="center"
			gap={1.5}
			sx={{
				py: 0,
				px: 2,
				color: isToday ? undefined : 'unset',
				my: 0,
				ml: 1,
			}}>
			<Avatar
				sx={(theme) => ({
					background: isToday ? theme.palette.primary.main : 'transparent',
					color: isToday ? theme.palette.primary.contrastText : 'inherit',
					minWidth: 'unset',
					m: -1,
					width: theme.spacing(3.5),
					height: theme.spacing(3.5),
				})}>
				{day.format('D')}
			</Avatar>
			<Typography
				sx={(theme) => ({ height: theme.spacing(3.5), lineHeight: theme.spacing(3.5), width: '7ch' })}
				variant="overline"
				color={isToday ? 'primary' : undefined}>
				{day.format('MMM')},&nbsp;{day.format('ddd')}
			</Typography>
		</Stack>
	)
}

interface JournalEntryListProps {
	type: JournalEntry['type'] | TransferEntry['type']
	journalRecordGroups: Record<string, JournalEntry[]> | Record<string, TransferEntry[]>
	onClickListItem: (event: any, entry: JournalEntry | TransferEntry) => void
	onDoubleClickListItem: (event: any, entry: JournalEntry | TransferEntry) => void
}

// const isTransferEntryRecordGroup = (
// 	journalRecordGroups: Record<string, JournalEntry[]> | Record<string, TransferEntry[]>
// ): journalRecordGroups is Record<string, TransferEntry[]> => {
// 	return [...Object.values(journalRecordGroups)].some((record: JournalEntry | TransferEntry) => {
// 		return record.type === 'TRANSFER_ENTRY'
// 	})
// }


export default function JournalEntryList(props: JournalEntryListProps) {
	const isTransferEntryList = props.type === 'TRANSFER_ENTRY' // isTransferEntryRecordGroup(props.journalRecordGroups)
	const theme = useTheme()
	const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
	const { getCategoriesQuery, getAccountsQuery, createJournalEntry } = useContext(JournalContext)
	const journalSliceContext = useContext(JournalSliceContext)
	const getPriceStyle = useGetPriceStyle()

	const currentDayString = useMemo(() => dayjs().format('YYYY-MM-DD'), [])

	const displayedJournalDates: Set<string> = new Set(Object.keys(props.journalRecordGroups))

	if (dateViewIsMonthlyPeriod(journalSliceContext.dateView)) {
		const startOfMonth: dayjs.Dayjs = dayjs(`${journalSliceContext.dateView.year}-${journalSliceContext.dateView.month}-01`)
		if (startOfMonth.isSame(currentDayString, 'month')) {
			displayedJournalDates.add(currentDayString)
		} else {
			displayedJournalDates.add(startOfMonth.format('YYYY-MM-DD'))
		}
	}

	return (
		<Table size="small" sx={{ overflowY: 'scroll' }}>
			{sortDatesChronologically(...displayedJournalDates)
				.map((date: string) => {
					const entries = props.journalRecordGroups[date] ?? []
					const day = dayjs(date)
					const isToday = day.isSame(dayjs(), 'day')
					const showQuckEditor = isToday || !entries.length

					return (
						<TableBody key={date}>
							<TableRow
								dateRow
								sx={{
									verticalAlign: (entries.length + (showQuckEditor ? 1 : 0)) > 1 ? 'top' : undefined
								}}
							>
								<TableCell rowSpan={entries.length + (showQuckEditor ? 2 : 1)}>
									<JournalEntryDate
										day={day}
										isToday={isToday}
										onClick={() => {
											createJournalEntry({
												date: day.format('YYYY-MM-DD'),
												type: isTransferEntryList ? 'TRANSFER_ENTRY' : 'JOURNAL_ENTRY'
											})
										}}
									/>
								</TableCell>
							</TableRow>
							
							{entries.map((entry) => {
								const { sourceAccountId, destAccountId } = (entry.type === 'TRANSFER_ENTRY' ? entry : {})
								const sourceAccount: Account | undefined = sourceAccountId
									? getAccountsQuery.data[sourceAccountId]
									: undefined

								const destinationAccount: Account | undefined = destAccountId
									? getAccountsQuery.data[destAccountId]
									: undefined

								const { categoryId } = entry
								const category: Category | undefined = categoryId
									? getCategoriesQuery.data[categoryId]
									: undefined

								const netAmount = calculateNetAmount(entry)
								const isFlagged = journalEntryIsFlagged(entry)
								const hasTags = journalEntryHasTags(entry)
								const hasTasks = journalEntryHasTasks(entry)
								const tasks: EntryTask[] = entry.tasks ?? []
								const numCompletedTasks: number = hasTasks ? tasks.filter((task) => task.completedAt).length : 0
								const taskProgressString = Math.max(numCompletedTasks, tasks.length) > 9
									? '9+'
									: `${numCompletedTasks}/${tasks.length}`
								const taskProgressPercentage = Math.round(100 * (numCompletedTasks / Math.max(tasks.length, 1)))

								return (
									<TableRow
										key={entry._id}
										onClick={(event) => props.onClickListItem(event, entry)}
										onDoubleClick={(event) => props.onDoubleClickListItem(event, entry)}
										selected={journalSliceContext.selectedRows[entry._id]}
									>
										<TableCell
											selectCheckbox
											sx={{
												width: '0%',
												position: 'relative',
											}}
										>
											<Checkbox
												className='checkbox'
												sx={{ m: -1 }}
												checked={journalSliceContext.selectedRows[entry._id] || false}
												onChange={() => journalSliceContext.toggleSelectedRow(entry._id)}
												onClick={(event) => event.stopPropagation()}
											/>
											<AvatarIcon
												className='icon'
												avatar={category?.avatar}
												sx={{
													position: 'absolute',
													top: '50%',
													left: '50%',
													transform: 'translate(-50%, -50%)',
												}}
											/>
										</TableCell>
										<TableCell sx={{ width: '20%' }}>
											<Typography sx={{ ml: -0.5 }}>
												{entry.memo || PLACEHOLDER_UNNAMED_JOURNAL_ENTRY_MEMO}
											</Typography>
										</TableCell>
										<TableCell sx={{ width: '20%' }}>
											{sourceAccount && (
												<AvatarChip icon avatar={sourceAccount.avatar} label={sourceAccount.label} />
											)}
											{(sourceAccount && destinationAccount) && (
												<Typography component='span'>&rarr;</Typography>
											)}
											{destinationAccount && (
												<AvatarChip icon avatar={destinationAccount.avatar} label={destinationAccount.label} />
											)}
											{(hasTasks && taskProgressPercentage < 100) && (
												<Stack alignItems='center' sx={{ my: -2 }}>
													<CircularProgressWithLabel value={taskProgressPercentage}>
														{taskProgressString}
													</CircularProgressWithLabel>
												</Stack>
											)}
										</TableCell>
										<TableCell sx={{ width: '0%' }}>
											<Stack direction='row'>
												<Grow in={isFlagged}>
													<Flag sx={{ display: 'block' }} />
												</Grow>
												<Grow in={hasTags}>
													<LocalOffer sx={{ display: 'block' }} />
												</Grow>
											</Stack>
										</TableCell>
										<TableCell align="right" sx={{ width: '10%' }}>
											<Typography sx={{ ...getPriceStyle(netAmount) }}>
												{getPriceString(netAmount)}
											</Typography>
										</TableCell>
										<TableCell>
											{category ? (
												<AvatarChip avatar={category.avatar} label={category.label} />
											) : (
												<Chip
													sx={(theme) => ({
														backgroundColor: alpha(
															theme.palette.grey[400],
															0.125
														),
													})}
													size='small'
													label="Uncategorized"
												/>
											)}
										</TableCell>
									</TableRow>
								)
							})}
										
							{showQuckEditor && (
								<TableRow buttonRow>
									<TableCell colSpan="100%">
										<QuickJournalEditor onAdd={isSmall ? () => {} : undefined} />
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					)
				})
			}
		</Table>
	)
}
