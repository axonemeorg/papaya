import { Attachment, Category, DateRange, Delete, LocalOffer, Paid } from "@mui/icons-material";
import { Box, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { ReactNode, useContext, useEffect, useState } from "react";
import CategoryFilter from "./filters/CategoryFilter";
import { JournalSnapshotContext } from "@/contexts/JournalSnapshopContext";
import AmountFilter from "./filters/AmountFilter";

export enum JournalFilterSlot {
    AMOUNT = 'AMOUNT',
    ATTACHMENTS = 'ATTACHMENTS',
    CATEGORIES = 'CATEGORIES',
    DATE_RANGE = 'DATE_RANGE',
    // RESERVED_TAGS = 'RESERVED_TAGS',
    TAGS = 'TAGS',
}

interface JournalFilterSlotProperties {
    label: string
    title: string
    icon: ReactNode
    component: ReactNode
}

const journalFilterSlots: Record<JournalFilterSlot, JournalFilterSlotProperties> = {
    [JournalFilterSlot.AMOUNT]: {
        label: 'Amount',
        icon: <Paid />,
        title: 'Amount is',
        component: (
            <AmountFilter />
        ),
    },
    
    [JournalFilterSlot.ATTACHMENTS]: {
        label: 'Attachments',
        icon: <Attachment />,
        title: 'Attachments are',
        component: (
            <div />
        ),
    },

    [JournalFilterSlot.CATEGORIES]: {
        label: 'Categories',
        icon: <Category />,
        title: 'Categories include',
        component: <CategoryFilter />
    },

    [JournalFilterSlot.DATE_RANGE]: {
        label: 'Date Range',
        icon: <DateRange />,
        title: 'Date',
        component: <div />
    },

    [JournalFilterSlot.TAGS]: {
        label: 'Tags',
        icon: <LocalOffer />,
        title: 'Tags include',
        component: (
            <div />
        ),
    },
}

const NON_IMPELEMENTED_FILTERS: Set<JournalFilterSlot> = new Set([
    JournalFilterSlot.ATTACHMENTS,
    JournalFilterSlot.DATE_RANGE,
    JournalFilterSlot.TAGS,
])

interface JournalFilterPickerProps {
    open: boolean
    anchorEl: any
    onClose: () => void
}

export default function JournalFilterPicker(props: JournalFilterPickerProps) {
    const [activeSlot, setActiveSlot] = useState<JournalFilterSlot | null>(null)

    const journalSnapshotContext = useContext(JournalSnapshotContext)

    const handleClickSlotButton = (slot: JournalFilterSlot) => {
        setActiveSlot(slot)
    }

    const handleRemoveActiveSlotFilters = () => {
        if (!activeSlot) {
            return
        }
        journalSnapshotContext.clearMemoryFilter(activeSlot)
        setActiveSlot(null)
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
                            const disabled = NON_IMPELEMENTED_FILTERS.has(key as JournalFilterSlot)
                            return (
                                <MenuItem
                                    key={key}
                                    disabled={disabled}
                                    onClick={disabled ? undefined : () => handleClickSlotButton(key as JournalFilterSlot)}
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
