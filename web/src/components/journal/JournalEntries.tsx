'use client'

import { useState } from "react";
import JournalEntryModal from "../modal/JournalEntryModal";
import { alpha, Avatar, Button, Chip, Fab, Icon, List, ListItem, ListItemIcon, ListItemText, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { JournalEntryContext } from "@/contexts/JournalEntryContext";
import { TransactionMethodContext } from "@/contexts/TransactionMethodContext";
import { CategoryContext } from "@/contexts/CategoryContext";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { JournalEntry } from "@/types/get";
import dayjs from "dayjs";
import { getMuiColor } from "../color/ColorPicker";

type JournalEntriesProps =
    & JournalEntryContext
    & TransactionMethodContext
    & CategoryContext;


interface JournalEntryGroup {
    date: string;
    entries: JournalEntry[]
}

// const groupedExampleJournalEntries: JournalEntryGroup[]  = [
//     {
//         date: '2024-08-01',
//         entries: [
//             {
//                 journalEntryId: 1,
//                 memo: 'Brunch at Shine Cafe',
//                 categoryId: 1,
//                 transactions: [
//                     {
//                         journalEntryId: 1,
//                         amount: 58.60,
//                         paymentType: "CREDIT",
//                         transactionMethod: {
//                             transactionMethodId: 1,
//                             label: 'My Mastercard'
//                         }
//                     }
//                 ]
//             },
//             {
//                 journalEntryId: 2,
//                 memo: 'Treats for Vinny',
//                 categoryId: 2,
//                 transactions: [
//                     {
//                         journalEntryId: 2,
//                         amount: 40.70,
//                         paymentType: "CREDIT",
//                         transactionMethod: {
//                             transactionMethodId: 1,
//                             label: 'My Mastercard'
//                         }
//                     }
//                 ]
//             },
//         ]
//     },
//     {
//         date: '2024-08-02',
//         entries: [
//             {
//                 journalEntryId: 3,
//                 memo: 'Brunch at Shine Cafe',
//                 categoryId: 1,
//                 transactions: [
//                     {
//                         journalEntryId: 3,
//                         amount: 58.60,
//                         paymentType: "CREDIT",
//                         transactionMethod: {
//                             transactionMethodId: 1,
//                             label: 'My Mastercard'
//                         }
//                     }
//                 ]
//             },
//             {
//                 journalEntryId: 4,
//                 memo: 'Treats for Vinny',
//                 categoryId: 2,
//                 transactions: [
//                     {
//                         journalEntryId: 4,
//                         amount: 40.70,
//                         paymentType: "CREDIT",
//                         transactionMethod: {
//                             transactionMethodId: 1,
//                             label: 'My Mastercard'
//                         }
//                     }
//                 ]
//             },
//         ]
//     }
// ]

const JournalEntryDate = ({ date }: { date: string })  => {
    const day = dayjs(date);
    const isToday = day.isSame(dayjs(), 'day');

    return (
        <Button color='inherit'>
            <Stack direction='row' alignItems='center' gap={1}>
                <Avatar
                    sx={(theme) => ({
                        background: isToday ? theme.palette.primary.main : 'transparent',
                        color: isToday ? theme.palette.primary.contrastText : 'inherit',
                    })}
                >
                    {day.format('D')}
                </Avatar>
                <Typography variant='inherit' color={isToday ? 'primary' : undefined}>
                    {day.format('MMM, ddd')}
                </Typography>
            </Stack>
        </Button>
    )
}

export default function JournalEntries(props: JournalEntriesProps) {
    const { journalEntries, transactionMethods, categories } = props;
    const [showJournalEntryModal, setShowJournalEntryModal] = useState<boolean>(false);

    const journal = journalEntries.reduce((acc: Record<string, JournalEntry[]>, entry: JournalEntry) => {
        const { date } = entry;
        if (acc[date]) {
            acc[date].push(entry);
        } else {
            acc[date] = [entry];
        }

        return acc;
    }, {});

    return (
        <CategoryContext.Provider value={{ categories }}>
            <TransactionMethodContext.Provider value={{ transactionMethods }}>
                <JournalEntryContext.Provider value={{ journalEntries }}>
                    
                    <Table>
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
                                        <TableCell width='180px'>
                                            <JournalEntryDate date={date} />
                                        </TableCell>
                                        <TableCell>
                                            <List>
                                                {entries.map((entry) => {
                                                    const category = categories.find((c) => c.categoryId === entry.categoryId);
                                                    const categoryColor = getMuiColor(category.color);
                                                    return (
                                                        <MenuItem key={entry.journalEntryId} sx={{ borderRadius: '64px' }}>
                                                            {/* <Stack direction='row' alignItems='center'> */}
                                                                <ListItemIcon>
                                                                    <Icon sx={{ color: categoryColor}}>{category.icon}</Icon>
                                                                </ListItemIcon>
                                                                <ListItemText>{entry.memo}</ListItemText>
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
                                                            {/* </Stack> */}
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
                </JournalEntryContext.Provider>
            </TransactionMethodContext.Provider>
        </CategoryContext.Provider>
    )
}
