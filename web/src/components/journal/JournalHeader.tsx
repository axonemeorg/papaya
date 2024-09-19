import { JournalDate } from "@/types/calendar";
import { getJournalDateUrl, getNextYearMonth, getPreviousYearMonth, getTodayYearAndMonth } from "@/utils/Utils";
import { Apps, ArrowBack, ArrowForward, ChevronLeft, ChevronRight, EventRepeat, Today } from "@mui/icons-material";
import { Button, ButtonBase, IconButton, Popover, Stack, Tooltip, Typography } from "@mui/material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

type JournalHeaderProps = PropsWithChildren<JournalDate>;

const formatMonthString = (year: number, month: number): string => {
    const day = dayjs([year, month].join('-'))
    if (day.isSame(dayjs(), 'year')) {
        return day.format('MMMM');
    }

    return day.format('MMM YYYY');
}

export default function JournalHeader({ month, year, children }: JournalHeaderProps) {
    const router = useRouter();

    const handleChangeDatePickerDate = (value: dayjs.Dayjs) => {
        const year = Number(value.format('YYYY'));
        const month = Number(value.format('M'));

        router.push(getJournalDateUrl({ year, month }));
    }

    return (
        <Stack direction='row' justifyContent='space-between' sx={{ flex: 1 }} alignItems='center'>
            <Stack direction='row' alignItems='center' gap={2}>
                <Stack direction='row' alignItems='center' gap={1}>
                    <Stack direction='row'>
                        <Link href={getJournalDateUrl(getPreviousYearMonth({ year, month }))}>
                            <Tooltip title='Previous month'>
                                <IconButton>
                                    <ChevronLeft />
                                </IconButton>
                            </Tooltip>
                        </Link>
                        <Link href={getJournalDateUrl(getNextYearMonth({ year, month }))}>
                            <Tooltip title='Next month'>
                                <IconButton>
                                    <ChevronRight />
                                </IconButton>
                            </Tooltip>
                        </Link>
                    </Stack>
                    <Typography variant='h5' sx={{ fontWeight: 500 }}>
                        {formatMonthString(year, month)}
                    </Typography>
                    <Popover open={true}>
                        
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar
                                views={['month', 'year']}
                                onChange={(value) => {handleChangeDatePickerDate(value)}}
                            />
                        </LocalizationProvider>
                    </Popover>
                </Stack>
                <Link href={'/journal'}>
                    <Tooltip title='Today'>
                        <IconButton color='inherit'>
                            <EventRepeat />
                        </IconButton>
                    </Tooltip>
                </Link>
            </Stack>
            <Stack direction='row' alignItems='center' gap={2}>
                {children}
            </Stack>
        </Stack>
    )
}
