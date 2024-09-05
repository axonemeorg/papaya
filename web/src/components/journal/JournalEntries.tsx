'use client'

import { MouseEvent, useContext, useState } from "react";
import JournalEntryModal from "../modal/JournalEntryModal";
import { alpha, Avatar, Box, Button, Chip, Fab, Icon, List, ListItemIcon, ListItemText, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { JournalEntryContext } from "@/contexts/JournalEntryContext";
import { TransactionMethodContext } from "@/contexts/TransactionMethodContext";
import { CategoryContext } from "@/contexts/CategoryContext";
import { JournalEntry } from "@/types/get";
import dayjs from "dayjs";
import { getMuiColor } from "../color/ColorPicker";
import { TransactionType } from "@/types/enum";
import JournalEntryCard from "./JournalEntryCard";
import { set } from "zod";

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

export default function JournalEntries() {
    const { journalEntries } = useContext(JournalEntryContext);
    const { transactionMethods } = useContext(TransactionMethodContext);
    const { categories } = useContext(CategoryContext);
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
    // console.log(journal)
    // console.log('methods:', transactionMethods)

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
                {/* <TableHead>
                    <TableCell sx={{ width: 'auto', whiteSpace: 'nowrap' }}>Date</TableCell>
                    <TableCell>Entries</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Method</TableCell>
                </TableHead> */}
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
                                            const category = categories.find((c) => c.categoryId === entry.categoryId);
                                            const categoryColor = getMuiColor(category.color);
                                            const { netAmount, methods } = entry.transactions.reduce(({ netAmount, methods }, transaction) => {
                                                if (transaction.transactionType === TransactionType.Enum.CREDIT) {
                                                    netAmount += transaction.amount;
                                                } else if (transaction.transactionType === TransactionType.Enum.DEBIT) {
                                                    netAmount -= transaction.amount;
                                                }
                                                const method = transactionMethods.find((m) => m.transactionMethodId === transaction.transactionMethodId);
                                                if (method && !methods.some((m) => m.transactionMethodId === method.transactionMethodId)) {
                                                    methods.push(method);
                                                }

                                                return { netAmount, methods };
                                            }, { netAmount: 0, methods: [] })
                                            return (
                                                <MenuItem
                                                    key={entry.journalEntryId}
                                                    sx={{ borderRadius: '64px' }}
                                                    onClick={(event) => handleClickListItem(event, entry)}
                                                >
                                                    <Stack direction='row' alignItems='center' gap={4}>
                                                        <Stack direction='row' alignItems='center'>
                                                            <ListItemIcon>
                                                                <Icon sx={{ color: categoryColor}}>{category.icon}</Icon>
                                                            </ListItemIcon>
                                                            <ListItemText sx={{ width: 200 }}>{entry.memo}</ListItemText>
                                                        </Stack>
                                                        <ListItemText sx={{ width: 100 , textAlign: 'right' }}>
                                                            ${netAmount}
                                                        </ListItemText>
                                                        <Box width={200}>
                                                            <Chip
                                                                size='small'
                                                                sx={{
                                                                    color: categoryColor,
                                                                    background: alpha(categoryColor, 0.125),
                                                                    fontWeight: 500
                                                                }}
                                                                // icon={<Icon color={categoryColor}>{category.icon}</Icon>}
                                                                label={category.label}
                                                            />
                                                        </Box>
                                                        <Stack direction='row' sx={{ width: 300 }} gap={0.5}>
                                                            {methods.map((method) => {
                                                                return (
                                                                    <Chip label={method.label} />
                                                                )
                                                            })}
                                                        </Stack>
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
