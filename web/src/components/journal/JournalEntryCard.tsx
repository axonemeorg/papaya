'use client';

import { JournalEntry } from "@/types/get";
import { Close, Delete, Edit, LocalPizza, MoreVert } from "@mui/icons-material";
import { Box, Icon, IconButton, Paper, Popover, Stack, Tooltip, Typography } from "@mui/material";
import CategoryIcon from "../icon/CategoryIcon";
import { getPriceString } from "@/utils/Utils";
import { deleteJournalEntry } from "@/actions/journal-actions";
import EditJournalEntryModal from "../modal/EditJournalEntryModal";
import { useContext, useMemo, useState } from "react";
import { NotificationsContext } from "@/contexts/NotificationsContext";
import { UpdateJournalEntry } from "@/types/put";

interface JournalEntryCard {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    entry: JournalEntry;
}

const JournalEntryNumber = (props: { value: string | number | null | undefined }) => {
    const entryNumberString = `#${props.value ?? ''}`

    const { snackbar } = useContext(NotificationsContext);

    const copyText = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault(); // Prevent the default anchor tag behavior
        navigator.clipboard.writeText(entryNumberString).then(() => {
            snackbar({ message: 'Copied to clipboard.' });
        }).catch(err => {
            console.error('Failed to copy journal entry number to clipboard: ', err);
        });
    };

    if (!props.value) {
        return <></>
    }

    return (
        <a onClick={copyText} href="#" style={{ textDecoration: 'none' }}>            
            <Typography variant='button'>{entryNumberString}</Typography>
        </a>
    )
}

export default function JournalEntryCard(props: JournalEntryCard) {
    const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
    const isNetPositive = props.entry.netAmount > 0;

    const { snackbar } = useContext(NotificationsContext);

    const handleDeleteEntry = () => {
        snackbar({
            message: 'Deleted 1 entry.'
        });
        props.onClose();
    }

    const editJournalEntryFormValues: UpdateJournalEntry = useMemo(() => {
        return {
            ...props.entry,
            transactions: props.entry.transactions?.map((transaction) => {
                return {
                    ...transaction,
                    amount: (transaction.amount / 100).toFixed(2),
                }
            })
        }
    }, [props.entry]);

    return (
        <>
            <EditJournalEntryModal
                initialValues={editJournalEntryFormValues}
                open={showEditDialog}
                onClose={() => setShowEditDialog(false)}
                onSave={() => props.onClose()}
            />
            <Popover
                anchorEl={props.anchorEl}
                open={Boolean(props.anchorEl)}
                onClose={props.onClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Stack gap={2} sx={{ minWidth: '400px' }}>
                    <Box p={1} mb={2}>
                        <Stack direction='row' justifyContent="space-between" alignItems={'center'} sx={{ mb: 2 }}>
                            <Box px={1}>
                                <JournalEntryNumber value={props.entry.entryNumber} />
                            </Box>
                            <Stack direction='row' gap={0.5}>
                                <IconButton size='small' onClick={() => setShowEditDialog(true)}>
                                    <Edit fontSize="small"/>
                                </IconButton>
                                <form action={deleteJournalEntry} onSubmit={() => handleDeleteEntry()}>
                                    <IconButton type='submit' size='small'><Delete fontSize="small" /></IconButton>
                                    <input type='hidden' name='journalEntryId' value={props.entry.journalEntryId} />
                                </form>
                                <IconButton size='small'><MoreVert fontSize="small" /></IconButton>
                                <IconButton size='small' sx={{ ml: 1 }} onClick={() => props.onClose()}>
                                    <Close fontSize="small" />
                                </IconButton>
                            </Stack>
                        </Stack>
                        <Stack sx={{ textAlign: 'center' }} alignItems='center'>
                            <Typography
                                variant='h3'
                                sx={(theme) => ({
                                    color: isNetPositive ? theme.palette.success.main : undefined,
                                    mb: 0.5
                                })}
                            >
                                {getPriceString(props.entry.netAmount)}</Typography>
                            <Stack direction='row' gap={1}>
                                <CategoryIcon category={props.entry.category} />
                                <Typography>{props.entry.memo}</Typography>
                            </Stack>
                        </Stack>
                    </Box>
                    {/* <Paper square variant='outlined' sx={{ p: 2, borderLeft: 'none', borderRight: 'none', borderBottom: 'none' }}>
                        Hello
                    </Paper> */}
                </Stack>
            </Popover>
        </>
    )
}
