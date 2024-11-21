'use client'

import React, { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
// import CreateJournalEntryModal from "../modal/CreateJournalEntryModal";
import { alpha, Avatar, Button, Chip, Fab, Grid2 as Grid, IconButton, List, ListItemIcon, ListItemText, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Add, Category as MuiCategoryIcon } from "@mui/icons-material";
import dayjs from "dayjs";
import { getPriceString } from "@/utils/Utils";
import QuickJournalEditor from "./QuickJournalEditor";
import NotificationsProvider from "@/providers/NotificationsProvider";
import BaseLayout from "../layout/BaseLayout";
import JournalHeader from "./JournalHeader";
import SettingsDrawer from "./categories/SettingsDrawer";
// import { useCategoryStore } from "@/store/useCategoriesStore";
import { JournalEntry } from "@/types/schema";
import { db } from "@/database/client";
import CreateJournalEntryModal from "../modal/CreateJournalEntryModal";

const JournalEntryDate = ({ day, isToday }: { day: dayjs.Dayjs, isToday: boolean })  => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Stack direction='row' alignItems='flex-end' gap={0.75} sx={{ p: 1, pb: isSmall ? 0 : undefined }}>
            <Avatar
                component={Button}
                sx={(theme) => ({
                    // display: 'block',
                    background: isToday ? theme.palette.primary.main : 'transparent',
                    color: isToday ? theme.palette.primary.contrastText : 'inherit',
                    minWidth: 'unset',
                    width: isSmall ? theme.spacing(4) : undefined,
                    height: isSmall ? theme.spacing(4) : undefined,
                })}
            >
                {day.format('D')}
            </Avatar>
            <Typography sx={{ mb: isSmall ? -0.25 : 0.25 }} variant='overline' color={isToday ? 'primary' : undefined}>
                {day.format('MMM')},&nbsp;{day.format('ddd')}
            </Typography>
        </Stack>
    )
}

export type JournalEditorView =
    | 'week'
    | 'month'
    | 'year'

export interface JournalEditorProps {
    view: JournalEditorView;
    date: string;
    onNextPage: () => void;
    onPrevPage: () => void;
    onDateChange: (date: string) => void;
}

export default function JournalEditor(props: JournalEditorProps) {
    const [showJournalEntryModal, setShowJournalEntryModal] = useState<boolean>(false);
    const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
    const [selectedEntryAnchorEl, setSelectedEntryAnchorEl] = useState<HTMLElement | null>(null);
    const [journalGroups, setJournalGroups] = useState<Record<string, JournalEntry[]>>({});

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    const currentDayString = dayjs().format('YYYY-MM-DD');

    const getJournalEntries: () => Promise<JournalEntry[]> = useCallback(async () => {
        const startDate = dayjs(props.date)
            .startOf(props.view)
            .format('YYYY-MM-DD');

        const endDate = dayjs(props.date)
            .endOf(props.view)
            .format('YYYY-MM-DD');

        const result = await db.find({
            selector: {
                type: 'JOURNAL_ENTRY',
                date: {
                    $gte: startDate,
                    $lte: endDate,
                }
            }
        });

        return result.docs as JournalEntry[];
       
    }, [props.date, props.view]);

    db.allDocs().then((value) => {
        const firstId = value.rows[0].id;
        db.get(firstId).then((doc) => {
            console.log('doc:', doc);
        });
    })


    useEffect(() => {
        getJournalEntries().then((entries) => {
            const groups: Record<string, JournalEntry[]> = entries.reduce((acc: Record<string, JournalEntry[]>, entry: JournalEntry) => {
                const { date } = entry;
                if (acc[date]) {
                    acc[date].push(entry);
                } else {
                    acc[date] = [entry];
                }

                return acc;
            }, {
                [currentDayString]: [],
            });

            setJournalGroups(groups);
        });
    }, [getJournalEntries])

    const handleClickListItem = (event: MouseEvent<any>, entry: JournalEntry) => {
        setSelectedEntryAnchorEl(event.currentTarget);
        setSelectedEntry(entry);
    }

    return (
        <NotificationsProvider>
            <CreateJournalEntryModal
                open={showJournalEntryModal}
                onClose={() => setShowJournalEntryModal(false)}
                initialDate={currentDayString}
            />
            <SettingsDrawer
                open={showSettingsDrawer}
                onClose={() => setShowSettingsDrawer(false)}
            />
            <BaseLayout
                headerChildren={
                    <JournalHeader
                        date={props.date}
                        view={props.view}
                        onNextPage={props.onNextPage}
                        onPrevPage={props.onPrevPage}
                        onDateChange={props.onDateChange}
                    >
                        <IconButton onClick={() => setShowSettingsDrawer(true)}>
                            <MuiCategoryIcon />
                        </IconButton>
                    </JournalHeader>
                }
                sx={{
                    // width: '100dvw',
                    // overflowX: 'auto',
                    px: {
                        sm: 0,
                        md: 4,
                    }
                }}   
            >
                <Fab
                    color='primary'
                    aria-label='add'
                    onClick={() => setShowJournalEntryModal(true)}
                    variant='extended'
                    size='large'
                    sx={(theme) => ({
                        position: 'fixed',
                        bottom: theme.spacing(4),
                        right: theme.spacing(2),
                    })}
                >
                    <Add />
                    Add
                </Fab>
                {/* {selectedEntry && (
                    <JournalEntryCard
                        entry={selectedEntry}
                        onClose={() => setSelectedEntryAnchorEl(null)}
                        anchorEl={selectedEntryAnchorEl}
                    />
                )} */}
                <Grid
                    container
                    columns={12}
                    sx={{
                        '--Grid-borderWidth': '1px',
                        borderColor: 'divider',
                        '& > div': {
                            borderBottom: 'var(--Grid-borderWidth) solid',
                            borderColor: 'divider',

                            '&.date-cell': {
                                borderWidth: {
                                    xs: '0',
                                    sm: '1px'
                                }
                            }
                        },
                    }}
                >
                    {Object
                        .entries(journalGroups)
                        .sort(([dateA, _a], [dateB, _b]) => {
                            return new Date(dateA).getTime() - new Date(dateB).getTime()
                        })
                        .map(([date, entries]) => {
                            const day = dayjs(date);
                            const isToday = day.isSame(dayjs(), 'day');

                            return (
                                <React.Fragment key={date}>
                                    <Grid size={{ xs: 12, sm: 2 }} className='date-cell'>
                                        <JournalEntryDate day={day} isToday={isToday} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 10 }}>
                                        {entries.length > 0 && (
                                            <List sx={{ pl: isSmall ? 1.75 : 1, pt: isSmall ? 0 : undefined }}>
                                                {entries.map((entry) => {
                                                    const { categoryIds } = entry;
                                                    const netAmount = -1;
                                                    const isNetPositive = netAmount > 0;

                                                    return (
                                                        <MenuItem
                                                            key={entry._id}
                                                            sx={{ borderRadius: '64px', pl: isSmall ? 4 : undefined }}
                                                            onClick={(event) => handleClickListItem(event, entry)}
                                                        >
                                                            <Grid container columns={12} sx={{ width: '100%', alignItems: 'center' }} spacing={2} rowSpacing={0}>
                                                                <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', flowFlow: 'row nowrap', }}>
                                                                    <ListItemIcon sx={{ display: isSmall ? 'none' : undefined }}>
                                                                        {/* <CategoryIcon category={null} /> */}
                                                                        Icon
                                                                    </ListItemIcon>
                                                                    <ListItemText>{entry.memo}</ListItemText>
                                                                </Grid>
                                                                <Grid size={{ xs: 'auto', sm: 3, md: 2 }}>
                                                                    <ListItemText
                                                                        sx={(theme) => ({ textAlign: 'right', color: isNetPositive ? theme.palette.success.main : undefined })}
                                                                    >
                                                                        {getPriceString(netAmount)}
                                                                    </ListItemText>
                                                                </Grid>
                                                                <Grid size={{ xs: 'grow', sm: 5, md: 6 }}>
                                                                    {/* {category ? (
                                                                        <CategoryChip category={category} />
                                                                    ) : (
                                                                        <Chip
                                                                            sx={ (theme) => ({ backgroundColor: alpha(theme.palette.grey[400], 0.125) })}
                                                                            label='Uncategorized'
                                                                        />
                                                                    )} */}
                                                                </Grid>
                                                            </Grid>
                                                        </MenuItem>
                                                    )
                                                })}
                                            </List>
                                        )}
                                        {isToday && (
                                            <QuickJournalEditor onAdd={isSmall ? () => setShowJournalEntryModal(true) : undefined} />
                                        )}
                                    </Grid>
                                </React.Fragment>
                            )
                        })
                    }
                </Grid>
            </BaseLayout>
        </NotificationsProvider>
    )
}
