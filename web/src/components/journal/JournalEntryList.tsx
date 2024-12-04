import { alpha, Avatar, Button, Chip, Grid2 as Grid, List, ListItemIcon, ListItemText, MenuItem, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from 'react';

import { Category, EnhancedJournalEntry } from "@/types/schema";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/database/queries";
import CategoryIcon from "../icon/CategoryIcon";
import { getPriceString } from "@/utils/string";
import CategoryChip from "../icon/CategoryChip";
import QuickJournalEditor from "./QuickJournalEditor";

interface JournalEntryListProps {
    journalRecordGroups: Record<string, EnhancedJournalEntry[]>;
    onClickListItem: (event: React.MouseEvent<HTMLLIElement, MouseEvent>, entry: EnhancedJournalEntry) => void;
}

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

export default function JournalEntryList(props: JournalEntryListProps) {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    const getCategoriesQuery = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        initialData: {},
    });

    return (
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
                .entries(props.journalRecordGroups)
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
                                            const categoryId: string | undefined = categoryIds?.[0];
                                            const category: Category | undefined = categoryId ? getCategoriesQuery.data[categoryId] : undefined;
                                            const netAmount = entry.netAmount
                                            const isNetPositive = netAmount > 0;

                                            return (
                                                <MenuItem
                                                    key={entry._id}
                                                    sx={{ borderRadius: '64px', pl: isSmall ? 4 : undefined }}
                                                    onClick={(event) => props.onClickListItem(event, entry)}
                                                >
                                                    <Grid container columns={12} sx={{ width: '100%', alignItems: 'center' }} spacing={2} rowSpacing={0}>
                                                        <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', flowFlow: 'row nowrap', }}>
                                                            <ListItemIcon sx={{ display: isSmall ? 'none' : undefined }}>
                                                                <CategoryIcon category={category} />
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
                                                            {category ? (
                                                                <CategoryChip category={category} />
                                                            ) : (
                                                                <Chip
                                                                    sx={ (theme) => ({ backgroundColor: alpha(theme.palette.grey[400], 0.125) })}
                                                                    label='Uncategorized'
                                                                />
                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                </MenuItem>
                                            )
                                        })}
                                    </List>
                                )}
                                {isToday && (
                                    <QuickJournalEditor onAdd={isSmall ? () => {} : undefined} />
                                )}
                            </Grid>
                        </React.Fragment>
                    )
                })
            }
        </Grid>
    )
}
