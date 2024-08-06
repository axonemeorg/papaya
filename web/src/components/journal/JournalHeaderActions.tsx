'use server'

import { JournalDate } from "@/types/calendar";
import { getJournalDateUrl, getNextYearMonth, getPreviousYearMonth, getTodayYearAndMonth } from "@/utils/Utils";
import { Apps, ArrowBack, ArrowForward } from "@mui/icons-material";
import { Button, ButtonBase, IconButton, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";



export default async function JournalHeaderActions({ month, year }: JournalDate) {
    return (
        <Stack direction='row' justifyContent='space-between' sx={{ flex: 1 }} alignItems='center'>
            <Stack direction='row' alignItems='center' gap={1}>
                <Link href={'/journal'}>
                    <Button
                        variant='outlined'
                        color='inherit'
                    >Today</Button>
                </Link>
                <Stack direction='row'>
                    <Link href={getJournalDateUrl(getPreviousYearMonth({ year, month }))}>
                        <IconButton>
                            <ArrowBack />
                        </IconButton>
                    </Link>
                    <Link href={getJournalDateUrl(getNextYearMonth({ year, month }))}>
                        <IconButton>
                            <ArrowForward />
                        </IconButton>
                    </Link>
                </Stack>
                <Typography variant='h4'>{dayjs([year, month].join('-')).format('MMMM YYYY')}</Typography>
                {/* <DateCalendar
                    defaultValue={dayjs('2022-04-17')}
                    views={['month', 'year']}
                    openTo="month"
                /> */}
            </Stack>
            <Stack direction='row'>
                <IconButton size="large"><Apps /></IconButton>
            </Stack>
        </Stack>
    )
}
