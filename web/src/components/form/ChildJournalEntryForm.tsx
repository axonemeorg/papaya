import { Checkbox, Grid2 as Grid, IconButton, Stack } from "@mui/material"
import AmountField from "../input/AmountField"
import CategoryAutocomplete from "../input/CategoryAutocomplete"
import { Delete, Flag, FlagOutlined } from "@mui/icons-material"
import { ChangeEvent } from "react"
import { JournalEntry } from "@/types/schema"


interface ChildJournalEntryFormProps {
    entry: JournalEntry
    selected: boolean
    onChange: (entry: JournalEntry) => void
    onSelectedChange: (selected: boolean) => void
}

export default function ChildJournalEntryForm(props: ChildJournalEntryFormProps) {
    const isFlagged = false
    const handleToggleFlagged = (event: ChangeEvent<HTMLInputElement>) => {
        const flagged = event.target.checked
        
    }

    return (
        <>
            <Stack direction='row' spacing={0} alignItems={'flex-start'} sx={{ width: '100%' }}>
                <Stack direction='row' spacing={-1}>
                    <Checkbox
                        checked={props.selected}
                        onChange={(event) => props.onSelectedChange(event.target.checked)}
                    />
                    <Checkbox
                        icon={<FlagOutlined />}
                        checkedIcon={<Flag />}
                        checked={isFlagged}
                        onChange={handleToggleFlagged}
                    />
                </Stack>
                <Grid container columns={12} spacing={1} sx={{ flex: '1', ml: 1 }}>
                    <Grid size={6}>
                        <AmountField
                            size='small'
                            value={props.entry.amount}
                            onChange={(event) => props.onChange({ ...props.entry, amount: event.target.value })}
                        />
                    </Grid>
                    <Grid size={6}>
                        <CategoryAutocomplete
                            size='small'
                            value={props.entry.categoryIds}
                            onChange={(_event, newValue) => props.onChange({ ...props.entry, categoryIds: newValue })}
                        />
                    </Grid>
                </Grid>
                <IconButton>
                    <Delete />
                </IconButton>
            </Stack>
        </>
    )
}
