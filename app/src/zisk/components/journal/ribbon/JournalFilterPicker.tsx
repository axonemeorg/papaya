import { Attachment, Category, DateRange, Delete, LocalOffer, Paid } from "@mui/icons-material";
import { Box, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { ReactNode, useContext, useEffect, useState } from "react";
import CategoryFilter from "./filters/CategoryFilter";
import AmountFilter from "./filters/AmountFilter";
import { SearchFacetKey } from "@/schema/support/search/facet";
import { JournalFilterContext } from "@/contexts/JournalFilterContext";

interface JournalFilterSlotProperties {
    label: string
    title: string
    icon: ReactNode
    component: ReactNode
}

const journalFilterSlots: Record<SearchFacetKey, JournalFilterSlotProperties> = {
    [SearchFacetKey.AMOUNT]: {
        label: 'Amount',
        icon: <Paid />,
        title: 'Amount is',
        component: (
            <AmountFilter />
        ),
    },
    
    // [SearchFacetKey.ATTACHMENTS]: {
    //     label: 'Attachments',
    //     icon: <Attachment />,
    //     title: 'Attachments are',
    //     component: (
    //         <div />
    //     ),
    // },

    [SearchFacetKey.CATEGORIES]: {
        label: 'Categories',
        icon: <Category />,
        title: 'Categories include',
        component: <CategoryFilter />
    },

    [SearchFacetKey.DATE]: {
        label: 'Date Range',
        icon: <DateRange />,
        title: 'Date',
        component: <div />
    },

    [SearchFacetKey.TAGS]: {
        label: 'Tags',
        icon: <LocalOffer />,
        title: 'Tags include',
        component: (
            <div />
        ),
    },
}

interface JournalFilterPickerProps {
    open: boolean
    anchorEl: any
    onClose: () => void
}

export default function JournalFilterPicker(props: JournalFilterPickerProps) {
    const [activeSlot, setActiveSlot] = useState<SearchFacetKey | null>(null)

    const journalFilterContext = useContext(JournalFilterContext)

    const handleClickSlotButton = (slot: SearchFacetKey) => {
        setActiveSlot(slot)
    }

    const handleRemoveSlot = (slot: SearchFacetKey | null) => {
        if (!slot) {
            return
        } else if (slot === SearchFacetKey.DATE) {
            // DATE filter slot should always be present.
            console.warn('Attempted to remove DATE search facet.')
            return
        }
        journalFilterContext?.updateJournalMemoryFilters((prev) => {
            const next = { ...prev }
            delete next[slot];
            return next
        })
    }

    const handleRemoveActiveSlotFilters = () => {
        if (!activeSlot) {
            return
        }
        setActiveSlot(null)
        handleRemoveSlot(activeSlot)
    }

    useEffect(() => {
        if (!props.open) {
            return
        }
        setActiveSlot(null)
    }, [props.open])

    return (
        <>
            <Menu
                anchorEl={props.anchorEl}
                open={props.open}
                onClose={props.onClose}
                slotProps={{
                    paper: {
                        sx: activeSlot ? (theme) => ({
                            width: '100%',
                            maxWidth: theme.spacing(60)
                        }) : undefined
                    }
                }}
            >
                <Box>
                    {activeSlot ? <>
                        <Stack
                            component='header'
                            direction='row'
                            alignItems='center'
                            justifyContent='space-between'
                            gap={2}
                            sx={{ px: 2, mt: -0.5 }}
                        >
                            <Typography variant='caption' sx={{ textTransform: 'unset', mb: -1 }}>
                                {journalFilterSlots[activeSlot].title}
                            </Typography>
                            <IconButton size='small' sx={{ mr: -1 }} onClick={() => handleRemoveActiveSlotFilters()}>
                                <Delete fontSize="small" />
                            </IconButton>
                        </Stack>
                        <Box sx={{ px: 2, py: 1, pt: 2 }}>
                            {journalFilterSlots[activeSlot].component}
                        </Box>
                    </> : <>
                        <TextField
                            size='small'
                            placeholder="Filter by..."
                            disabled
                            autoFocus
                            sx={{ m: 1, mt: 0 }}
                        />
                        {Object.entries(journalFilterSlots).map(([key, properties]) => {
                            return (
                                <MenuItem
                                    key={key}
                                    onClick={() => handleClickSlotButton(key as SearchFacetKey)}
                                    dense
                                >
                                    <ListItemIcon sx={(theme) => ({ color: theme.palette.text.secondary })}>{properties.icon}</ListItemIcon>
                                    <ListItemText>{properties.label}</ListItemText>
                                </MenuItem>
                            )
                        })}
                    </>}
                </Box>
            </Menu>
        </>
    )
}
