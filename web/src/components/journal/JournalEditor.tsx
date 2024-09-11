'use client'

import { MouseEvent, useMemo, useState } from "react";
import CreateJournalEntryModal from "../modal/CreateJournalEntryModal";
import { alpha, Avatar, Box, Button, Chip, Fab, List, ListItemIcon, ListItemText, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { Category, JournalEntry } from "@/types/get";
import dayjs from "dayjs";
import JournalEntryCard from "./JournalEntryCard";
import CategoryIcon from "../icon/CategoryIcon";
import CategoryChip from "../icon/CategoryChip";
import { getPriceString } from "@/utils/Utils";
import { CategoryContext } from "@/contexts/CategoryContext";
import QuickJournalEditor from "./QuickJournalEditor";

const JournalEntryDate = ({ day, isToday }: { day: dayjs.Dayjs, isToday: boolean })  => {
    return (
        <Button color='inherit' sx={{ borderRadius: 1 }}>
            <Stack direction='row' alignItems='flex-end' gap={0.75}>
                <Avatar
                    sx={(theme) => ({
                        background: isToday ? theme.palette.primary.main : 'transparent',
                        color: isToday ? theme.palette.primary.contrastText : 'inherit',
                    })}
                >
                    {day.format('D')}
                </Avatar>
                <Typography mb={0.25} variant='overline' color={isToday ? 'primary' : undefined}>
                    {day.format('MMM, ddd')}
                </Typography>
            </Stack>
        </Button>
    )
}

interface JournalEditorProps {
    journalEntries: JournalEntry[];
    categories: Category[];
}

export default function JournalEditor(props: JournalEditorProps) {
    const { journalEntries } = props;
    const [showJournalEntryModal, setShowJournalEntryModal] = useState<boolean>(false);
    
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
    const [selectedEntryAnchorEl, setSelectedEntryAnchorEl] = useState<HTMLElement | null>(null);

    const currentDayString = dayjs().format('YYYY-MM-DD');

    const journal = useMemo(() => {
        
        return journalEntries.reduce((acc: Record<string, JournalEntry[]>, entry: JournalEntry) => {
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
    }, [journalEntries]);

    const handleClickListItem = (event: MouseEvent<HTMLLIElement, MouseEvent>, entry: JournalEntry) => {
        setSelectedEntryAnchorEl(event.currentTarget);
        setSelectedEntry(entry);
    }

    return (
        <CategoryContext.Provider value={{ categories: props.categories }}>
            {selectedEntry && (
                <JournalEntryCard
                    entry={selectedEntry}
                    onClose={() => setSelectedEntryAnchorEl(null)}
                    anchorEl={selectedEntryAnchorEl}
                />
            )}
            <Table size='small'>
                <TableBody>
                    {Object
                        .entries(journal)
                        .sort(([dateA, _a], [dateB, _b]) => {
                            return new Date(dateA).getTime() - new Date(dateB).getTime()
                        })
                        .map(([date, entries]) => {
                            const day = dayjs(date);
                            const isToday = day.isSame(dayjs(), 'day');

                            return (
                                <TableRow key={date}>
                                    <TableCell width='180px' sx={{ verticalAlign: 'top' }}>
                                        <JournalEntryDate day={day} isToday={isToday} />
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        {entries.length > 0 && (

                                            
                                            <List>
                                                {entries.map((entry) => {
                                                    const { category } = entry;
                                                    const { netAmount, methods } = entry;
                                                    const isNetPositive = netAmount > 0;

                                                    return (
                                                        <MenuItem
                                                            key={entry.journalEntryId}
                                                            sx={{ borderRadius: '64px' }}
                                                            onClick={(event) => handleClickListItem(event, entry)}
                                                        >
                                                            <Stack direction='row' alignItems='center' gap={4}>
                                                                <Stack direction='row' alignItems='center'>
                                                                    <ListItemIcon>
                                                                        <CategoryIcon category={category} />
                                                                    </ListItemIcon>
                                                                    <ListItemText sx={{ width: 200 }}>{entry.memo}</ListItemText>
                                                                </Stack>
                                                                <ListItemText
                                                                    sx={(theme) => ({ width: 100, textAlign: 'right', color: isNetPositive ? theme.palette.success.main : undefined })}
                                                                >
                                                                    {getPriceString(netAmount)}
                                                                </ListItemText>
                                                                <Box width={200}>
                                                                    {category ? (
                                                                        <CategoryChip category={category} />
                                                                    ) : (
                                                                        <Chip
                                                                            sx={ (theme) => ({ backgroundColor: alpha(theme.palette.grey[400], 0.125) })}
                                                                            label='Uncategorized'
                                                                        />
                                                                    )}
                                                                </Box>
                                                                {/* <Stack direction='row' sx={{ width: 300 }} gap={0.5}>
                                                                    {methods.map((method) => {
                                                                        return (
                                                                            <Chip label={method.label} />
                                                                        )
                                                                    })}
                                                                </Stack> */}
                                                            </Stack>
                                                        </MenuItem>
                                                    )
                                                })}
                                            </List>
                                        )}
                                        
                                        {isToday && (
                                            <QuickJournalEditor />
                                        )}
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>

            <CreateJournalEntryModal
                open={showJournalEntryModal}
                onClose={() => setShowJournalEntryModal(false)}
                initialDate={currentDayString}
            />
            <Fab color='primary' aria-label='add' onClick={() => setShowJournalEntryModal(true)}>
                <Add />
            </Fab>
        </CategoryContext.Provider>
    )
}
