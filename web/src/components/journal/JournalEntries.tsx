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

const groupedExampleJournalEntries: JournalEntryGroup[]  = [
    {
        date: '2024-08-01',
        entries: [
            {
                journalEntryId: 1,
                memo: 'Brunch at Shine Cafe',
                categoryId: 1,
                transactions: [
                    {
                        journalEntryId: 1,
                        amount: 58.60,
                        paymentType: "CREDIT",
                        transactionMethod: {
                            transactionMethodId: 1,
                            label: 'My Mastercard'
                        }
                    }
                ]
            },
            {
                journalEntryId: 1,
                memo: 'Treats for Vinny',
                categoryId: 2,
                transactions: [
                    {
                        journalEntryId: 1,
                        amount: 40.70,
                        paymentType: "CREDIT",
                        transactionMethod: {
                            transactionMethodId: 1,
                            label: 'My Mastercard'
                        }
                    }
                ]
            },
        ]
    },
    {
        date: '2024-08-02',
        entries: [
            {
                journalEntryId: 1,
                memo: 'Brunch at Shine Cafe',
                categoryId: 1,
                transactions: [
                    {
                        journalEntryId: 1,
                        amount: 58.60,
                        paymentType: "CREDIT",
                        transactionMethod: {
                            transactionMethodId: 1,
                            label: 'My Mastercard'
                        }
                    }
                ]
            },
            {
                journalEntryId: 1,
                memo: 'Treats for Vinny',
                categoryId: 2,
                transactions: [
                    {
                        journalEntryId: 1,
                        amount: 40.70,
                        paymentType: "CREDIT",
                        transactionMethod: {
                            transactionMethodId: 1,
                            label: 'My Mastercard'
                        }
                    }
                ]
            },
        ]
    }
]

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

    const rows = journalEntries.map((entry) => {
        return {
            id: entry.categoryId,
            memo: entry.memo,
            date: entry.transactions[0].createdAt,
            category: entry

        }
    })

    // const columns: GridColDef<Type>[] = [
    //     {

    //     }
    // ]

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
                            {groupedExampleJournalEntries.map((group) => {
                                return (
                                    <TableRow>
                                        <TableCell width='180px'>
                                            <JournalEntryDate date={group.date} />
                                        </TableCell>
                                        <TableCell>
                                            <List>
                                                {group.entries.map((entry) => {
                                                    const category = categories[2];
                                                    const categoryColor = getMuiColor(category.color);
                                                    return (
                                                        <MenuItem sx={{ borderRadius: '64px' }}>
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
                    />
                    <Fab color='primary' aria-label='add' onClick={() => setShowJournalEntryModal(true)}>
                        <Add />
                    </Fab>
                </JournalEntryContext.Provider>
            </TransactionMethodContext.Provider>
        </CategoryContext.Provider>
    )
}
