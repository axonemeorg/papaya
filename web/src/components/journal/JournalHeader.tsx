import { JournalDate } from "@/types/calendar";
import { getJournalDateUrl, getNextYearMonth, getPreviousYearMonth, getTodayYearAndMonth } from "@/utils/Utils";
import { Apps, ArrowBack, ArrowBackIos, ArrowDropDown, ArrowForward, ArrowForwardIos, ChevronLeft, ChevronRight, EventRepeat, Today } from "@mui/icons-material";
import { Button, ButtonBase, IconButton, Popover, Stack, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useState } from "react";

type JournalHeaderProps = PropsWithChildren<JournalDate>;

const formatMonthString = (year: number, month: number): string => {
    const day = dayjs([year, month].join('-'))
    if (day.isSame(dayjs(), 'year')) {
        return day.format('MMMM');
    }

    return day.format('MMM YYYY');
}

export default function JournalHeader({ month, year, children }: JournalHeaderProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const router = useRouter();

    const handleChangeDatePickerDate = (value: dayjs.Dayjs) => {
        const year = Number(value.format('YYYY'));
        const month = Number(value.format('M'));

        router.push(getJournalDateUrl({ year, month }));
    }

    const theme = useTheme();
    const hideNextPrevButtons = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Stack direction='row' justifyContent='space-between' sx={{ flex: 1 }} alignItems='center' gap={1}>
            <Stack direction='row' alignItems='center' gap={2}>
                <Stack direction='row' alignItems='center' gap={1}>
                    {!hideNextPrevButtons && (
                        <Stack direction='row'>
                            <Link href={getJournalDateUrl(getPreviousYearMonth({ year, month }))}>
                                <Tooltip title='Previous month'>
                                    <IconButton>
                                        <ArrowBackIos />
                                    </IconButton>
                                </Tooltip>
                            </Link>
                            <Link href={getJournalDateUrl(getNextYearMonth({ year, month }))}>
                                <Tooltip title='Next month'>
                                    <IconButton>
                                        <ArrowForwardIos />
                                    </IconButton>
                                </Tooltip>
                            </Link>
                        </Stack>
                    )}
                    <Button color='inherit' endIcon={<ArrowDropDown />} onClick={(e) => setAnchorEl(e.currentTarget)}>
                        <Typography variant='h5' sx={{ fontWeight: 500 }}>
                            {formatMonthString(year, month)}
                        </Typography>
                    </Button>
                    <Popover
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        anchorEl={anchorEl}
                    >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar
                                views={['month', 'year']}
                                onChange={(value) => {handleChangeDatePickerDate(value)}}
                            />
                        </LocalizationProvider>
                    </Popover>
                </Stack>
                {/* <Link href={'/journal'}>
                    <Tooltip title='Today'>
                        <IconButton color='inherit'>
                            <EventRepeat />
                        </IconButton>
                    </Tooltip>
                </Link> */}
            </Stack>
            <Stack direction='row' alignItems='center' gap={2}>
                {children}
            </Stack>
        </Stack>
    )
}
