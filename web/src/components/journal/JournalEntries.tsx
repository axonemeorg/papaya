'use client'

import { MouseEvent, useState } from "react";
import JournalEntryModal from "../modal/JournalEntryModal";
import { alpha, Avatar, Box, Button, Chip, Fab, List, ListItemIcon, ListItemText, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { JournalEntry } from "@/types/get";
import dayjs from "dayjs";
import JournalEntryCard from "./JournalEntryCard";
import CategoryIcon from "../icon/CategoryIcon";
import CategoryChip from "../icon/CategoryChip";
import { getPriceString } from "@/utils/Utils";

const JournalEntryDate = ({ date }: { date: string })  => {
    const day = dayjs(date);
    const isToday = day.isSame(dayjs(), 'day');

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

export default function JournalEntries(props) {
    const { journalEntries } = props;
    const [showJournalEntryModal, setShowJournalEntryModal] = useState<boolean>(false);
    
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
    const [selectedEntryAnchorEl, setSelectedEntryAnchorEl] = useState<HTMLElement | null>(null);

    const journal = journalEntries.reduce((acc: Record<string, JournalEntry[]>, entry: JournalEntry) => {
        const { date } = entry;
        if (acc[date]) {
            acc[date].push(entry);
        } else {
            acc[date] = [entry];
        }

        return acc;
    }, {});

    const handleClickListItem = (event: MouseEvent<HTMLLIElement, MouseEvent>, entry: JournalEntry) => {
        setSelectedEntryAnchorEl(event.currentTarget);
        setSelectedEntry(entry);
    }

    return (
        <>
            {selectedEntry && (
                <JournalEntryCard
                    entry={selectedEntry}
                    onClose={() => setSelectedEntryAnchorEl(null)}
                    anchorEl={selectedEntryAnchorEl}
                />
            )}
            <Table size='small'>
                <TableBody>
                    {Object.entries(journal).map(([date, entries]) => {
                        return (
                            <TableRow key={date}>
                                <TableCell width='180px' sx={{ verticalAlign: 'top' }}>
                                    <JournalEntryDate date={date} />
                                </TableCell>
                                <TableCell sx={{ verticalAlign: 'top' }}>
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
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>

            <JournalEntryModal
                open={showJournalEntryModal}
                onClose={() => setShowJournalEntryModal(false)}
                initialDate={dayjs().format('YYYY-MM-DD')}
            />
            <Fab color='primary' aria-label='add' onClick={() => setShowJournalEntryModal(true)}>
                <Add />
            </Fab>
        </>
    )
}
