'use client';

import { Close, Delete, Edit, MoreVert } from "@mui/icons-material";
import { Box, IconButton, Popover, Stack, Typography } from "@mui/material";
import AvatarIcon from "@/components/icon/AvatarIcon";
import { useContext, useMemo, useState } from "react";
import { NotificationsContext } from "@/contexts/NotificationsContext";
import { JOURNAL_ENTRY_LOUPE_SEARCH_PARAM_KEY } from "./JournalEntryLoupe";
import { useRouter } from "next/router";
import { getPriceString } from "@/utils/string";
import { Category, EditJournalEntryForm, EnhancedJournalEntry } from "@/types/schema";
import { JournalEntrySelection } from "./JournalEditor";
import EditJournalEntryModal from "../modal/EditJournalEntryModal";
import { JournalContext } from "@/contexts/JournalContext";

interface JournalEntryCardProps extends JournalEntrySelection {
    entry: EnhancedJournalEntry;
    onClose: () => void;
    onDelete: () => void;
    onSave: () => void;
}

const JournalEntryNumber = (props: { value: string | number | null | undefined }) => {
    const { snackbar } = useContext(NotificationsContext);

    const router = useRouter();
    const currentPath = router.pathname;

    const entryNumber = Number(props.value ?? 0);
    const entryNumberString = `#${entryNumber}`;
    const entryLink = `${currentPath}?${JOURNAL_ENTRY_LOUPE_SEARCH_PARAM_KEY}=${entryNumber}`;

    const copyText = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault(); // Prevent the default anchor tag behavior
        navigator.clipboard.writeText(entryNumberString).then(() => {
            snackbar({ message: 'Copied to clipboard.' });
        }).catch(err => {
            console.error('Failed to copy journal entry number to clipboard: ', err);
        });
    };

    if (!entryNumber) {
        return <></>
    }

    return (
        <a onClick={copyText} href={entryLink} style={{ textDecoration: 'none' }}>            
            <Typography variant='button'>{entryNumberString}</Typography>
        </a>
    )
}

export default function JournalEntryCard(props: JournalEntryCardProps) {
    const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
    const { entry, anchorEl } = props;


    const isNetPositive = Boolean(entry && entry.netAmount > 0);

    const handleDeleteEntry = () => {
        props.onDelete();
    }

    const { getCategoriesQuery } = useContext(JournalContext);

    // const getArtifactsQuery = useQuery<Record<EntryArtifact['_id'], EntryArtifact>>({
    //     queryKey: ['entryArtifacts'],
    //     queryFn: getArtifacts,
    //     initialData: {},
    // });

    const editJournalEntryFormValues: EditJournalEntryForm = useMemo(() => {
        return {
            parent: {
                ...props.entry,
            },
            children: [
                ...props.entry.children
            ],
            artifacts: [
                ...props.entry.artifacts
            ],
        };
    }, [props.entry]);

    const categoryId: string | undefined = entry?.categoryIds?.[0];
    const category: Category | undefined = categoryId ? getCategoriesQuery.data[categoryId] : undefined;
    const netAmount: number = entry?.netAmount ?? 0;
    const memo = entry?.memo ?? '';

    return (
        <>
            <EditJournalEntryModal
                initialValues={editJournalEntryFormValues}
                open={showEditDialog}
                onClose={() => setShowEditDialog(false)}
                onSave={() => props.onSave()}
            />
            <Popover
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
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
                                <JournalEntryNumber
                                    value={null}
                                />
                            </Box>
                            <Stack direction='row' gap={0.5}>
                                <IconButton size='small' onClick={() => setShowEditDialog(true)}>
                                    <Edit fontSize="small"/>
                                </IconButton>

                                <IconButton type='submit' size='small' onClick={() => handleDeleteEntry()}>
                                    <Delete fontSize="small" />
                                </IconButton>

                                <IconButton size='small'>
                                    <MoreVert fontSize="small" />
                                </IconButton>

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
                                {getPriceString(netAmount)}
                            </Typography>
                            <Stack direction='row' gap={1}>
                                <AvatarIcon avatar={category?.avatar} />
                                <Typography>{memo}</Typography>
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
