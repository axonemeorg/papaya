import React, { MouseEvent, useContext, useEffect, useMemo, useState } from "react";
import { alpha, Avatar, Box, Button, Chip, Divider, Fab, Grid2 as Grid, IconButton, List, ListItemIcon, ListItemText, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Add } from "@mui/icons-material";
import dayjs from "dayjs";
import JournalHeader from "./JournalHeader";
import SettingsDrawer from "./categories/SettingsDrawer";
import { EnhancedJournalEntry } from "@/types/schema";
import CreateJournalEntryModal from "../modal/CreateJournalEntryModal";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getEnhancedJournalEntries } from "@/database/queries";
import JournalEntryCard from "./JournalEntryCard";
import { deleteJournalEntry, undeleteJournalEntry } from "@/database/actions";
import { NotificationsContext } from "@/contexts/NotificationsContext";
import JournalEntryList from "./JournalEntryList";
import { JournalContext } from "@/contexts/JournalContext";

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

export interface JournalEntrySelection {
    entry: EnhancedJournalEntry | null;
    anchorEl: HTMLElement | null;
}

export default function JournalEditor(props: JournalEditorProps) {
    const [showJournalEntryModal, setShowJournalEntryModal] = useState<boolean>(false);
    const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);
    const [selectedEntry, setSelectedEntry] = useState<JournalEntrySelection>({
        entry: null,
        anchorEl: null,
    });
    const [journalGroups, setJournalGroups] = useState<Record<string, EnhancedJournalEntry[]>>({});

    const { snackbar } = useContext(NotificationsContext);
    const { getCategoriesQuery } = useContext(JournalContext);

    const currentDayString = useMemo(() => dayjs().format('YYYY-MM-DD'), []);

    const getJournalEntriesQuery = useQuery<Record<EnhancedJournalEntry['_id'], EnhancedJournalEntry>>({
        queryKey: ['enhanced-journal-entries', props.view, props.date],
        queryFn: async () => {
            const entries = await getEnhancedJournalEntries(props.view, props.date);

            const groups: Record<string, EnhancedJournalEntry[]> = Object.values(entries)
                .reduce((acc: Record<string, EnhancedJournalEntry[]>, entry: EnhancedJournalEntry) => {
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

            return entries;
        },
        initialData: {},
        enabled: true,
    });

    const handleClickListItem = (event: MouseEvent<any>, entry: EnhancedJournalEntry) => {
        setSelectedEntry({
            anchorEl: event.currentTarget,
            entry: entry,
        });
    }

    const handleDeselectListItem = () => {
        setSelectedEntry((prev) => {
            const next = {
                ...prev,
                anchorEl: null,
            };
            return next;
        });
    }

    const handleDeleteEntry = async (entry: EnhancedJournalEntry | null) => {
        if (!entry) {
            return;
        }

        try {
            const record = await deleteJournalEntry(entry._id);
            getJournalEntriesQuery.refetch();
            handleDeselectListItem();
            snackbar({
                message: 'Deleted 1 entry',
                action: {
                    label: 'Undo',
                    onClick: async () => {
                        undeleteJournalEntry(record)
                            .then(() => {
                                getCategoriesQuery.refetch();
                                snackbar({ message: 'Category restored' });
                            })
                            .catch((error) => {
                                console.error(error);
                                snackbar({ message: 'Failed to restore category: ' + error.message });
                            });
                    }
                }
            });
        } catch {
            snackbar({ message: 'Failed to delete entry' });
        }
    }

    const handleSaveEntry = () => {
        getJournalEntriesQuery.refetch();
        handleDeselectListItem();
    }

    // show all docs
    // useEffect(() => {
    //     db.allDocs({ include_docs: true }).then((result) => {
    //         console.log('all docs', result);
    //     });
    // }, []);

    return (
        <>
            <CreateJournalEntryModal
                open={showJournalEntryModal}
                onClose={() => setShowJournalEntryModal(false)}
                onSaved={() => {
                    getJournalEntriesQuery.refetch();
                    setShowJournalEntryModal(false);
                }}
                initialDate={currentDayString}
            />
            <SettingsDrawer
                open={showSettingsDrawer}
                onClose={() => setShowSettingsDrawer(false)}
            />
            <Box
                sx={{
                    px: { sm: 0, }
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
                {selectedEntry.entry && (
                    <JournalEntryCard
                        entry={selectedEntry.entry}
                        anchorEl={selectedEntry.anchorEl}
                        onClose={() => handleDeselectListItem()}
                        onDelete={() => handleDeleteEntry(selectedEntry.entry)}
                        onSave={() => handleSaveEntry()}
                    />
                )}
                <JournalHeader
                    date={props.date}
                    view={props.view}
                    onNextPage={props.onNextPage}
                    onPrevPage={props.onPrevPage}
                    onDateChange={props.onDateChange}
                    reversed
                />
                <Divider />
                <JournalEntryList
                    journalRecordGroups={journalGroups}
                    onClickListItem={handleClickListItem}
                />
            </Box>
        </>
    );
}
