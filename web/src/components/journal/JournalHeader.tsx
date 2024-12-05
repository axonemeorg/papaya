import { JournalEntryContext } from "@/contexts/JournalEntryContext";
import { ArrowBack, ArrowBackIos, ArrowDropDown, ArrowForward, ArrowForwardIos, ChevronLeft, ChevronRight, EventRepeat, Today } from "@mui/icons-material";
import { Button, IconButton, Popover, Stack, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DateCalendar, DateView, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";

type JournalHeaderProps = PropsWithChildren<{
    reverseActionOrder?: boolean;
}>

export default function JournalHeader(props: JournalHeaderProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    
    const journalEntryContext = useContext(JournalEntryContext);

    const handleChangeDatePickerDate = (value: dayjs.Dayjs) => {
        journalEntryContext.setDate(value.format('YYYY-MM-DD'));
    }

    const theme = useTheme();
    const hideNextPrevButtons = useMediaQuery(theme.breakpoints.down('md'));
    const headingSize = useMediaQuery(theme.breakpoints.down('sm')) ? 'h6' : 'h5'

    const now = useMemo(() => dayjs(), []);

    const nextButtonTooltip = useMemo(() => {
        if (journalEntryContext.view === 'month') {
            return 'Next month';
        }
        if (journalEntryContext.view === 'year') {
            return 'Next year';
        }
        if (journalEntryContext.view === 'week') {
            return 'Next week';
        }
    }, [journalEntryContext.view]);

    const prevButtonTooltip = useMemo(() => {
        if (journalEntryContext.view === 'month') {
            return 'Previous month';
        }
        if (journalEntryContext.view === 'year') {
            return 'Previous year';
        }
        if (journalEntryContext.view === 'week') {
            return 'Previous week';
        }
    }, [journalEntryContext.view]);

    const formattedDateString = useMemo(() => {
        const date = dayjs(journalEntryContext.date);
        switch (journalEntryContext.view) {
            case 'month':
                const isCurrentYear = date.isSame(now, 'year');
                if (isCurrentYear) {
                    return date.format('MMMM');
                }

                return date.format('MMM YYYY');
            case 'year':
                return date.format('YYYY');
            case 'week':
            default:
                const startOfWeek = date.startOf('week');
                const endOfWeek = date.endOf('week');
                // Format into form "Jan 1 - 7, 2022"
                return `${startOfWeek.format('MMM D')} - ${endOfWeek.format('D, YYYY')}`;
            
        }
    }, [journalEntryContext.date, journalEntryContext.view]);

    const calendarAvailableViews = useMemo((): DateView[] => {
        switch (journalEntryContext.view) {
            case 'month':
            default:
                return ['month', 'year'];
            case 'year':
                return ['year'];
            case 'week':
                return ['year', 'month', 'day'];
        }
    }, [journalEntryContext.view]);

    const formattedCurrentDay = useMemo(() => {
        return now.format('dddd, MMMM D');
    }, []);

    const jumpToToday = useCallback(() => {
        journalEntryContext.setDate(now.format('YYYY-MM-DD'));
    }, [journalEntryContext.view]);

    return (
        <>
            <Popover
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorEl={anchorEl}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                        views={calendarAvailableViews}
                        onChange={(value) => {handleChangeDatePickerDate(value)}}
                    />
                </LocalizationProvider>
            </Popover>
            <Stack
                component='header'
                direction='row'
                justifyContent='space-between'
                sx={{ flex: 1, py: 1, px: 2 }}
                alignItems='center'
                flexDirection={props.reverseActionOrder ? 'row-reverse' : 'row'}
                gap={1}
            >
                <Stack direction='row' alignItems='center' gap={2}>
                    {props.children}
                </Stack>
                <Stack direction='row' alignItems='center' gap={2} flexDirection={props.reverseActionOrder ? 'row-reverse' : 'row'}>
                    <Tooltip title={formattedCurrentDay}>
                        <IconButton color='inherit' onClick={() => jumpToToday()}>
                            <EventRepeat />
                        </IconButton>
                    </Tooltip>
                    <Stack direction='row' alignItems='center' gap={1}>
                        <Button color='inherit' endIcon={<ArrowDropDown />} onClick={(e) => setAnchorEl(e.currentTarget)}>
                            <Typography variant={headingSize} sx={{ fontWeight: 500, minWidth: '9ch', textAlign: 'left' }}>
                                {formattedDateString}
                            </Typography>
                        </Button>
                        {!hideNextPrevButtons && (
                            <Stack direction='row'>
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
