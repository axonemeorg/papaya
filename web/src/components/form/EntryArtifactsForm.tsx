import { Checkbox, Collapse, Grid2 as Grid, Grow, IconButton, Stack, TextField } from "@mui/material"
import AmountField from "../input/AmountField"
import CategoryAutocomplete from "../input/CategoryAutocomplete"
import { Delete, Flag, FlagOutlined } from "@mui/icons-material"
import { ChangeEvent } from "react"
import { EntryArtifact, JournalEntry } from "@/types/schema"
import { Controller, UseFieldArrayReturn, useFormContext } from "react-hook-form"

interface EntryArtifactsFormProps {
    fieldArray: UseFieldArrayReturn<JournalEntry, "artifacts", "_id">
    selection: string[]
    onSelectionChange: (selection: string[]) => void
}

export default function EntryArtifactsForm(props: EntryArtifactsFormProps) {
    const { control, register } = useFormContext<JournalEntry>()

    const handleToggleSelected = (artifactId: EntryArtifact['_id']) => {
        const isSelected = props.selection.includes(artifactId)
        if (isSelected) {
            props.onSelectionChange(props.selection.filter((id) => id !== artifactId))
        } else {
            props.onSelectionChange([...props.selection, artifactId])
        }
    }

    return (
        <>
            {props.fieldArray.fields.map((entry, index) => {
                return (
                    <Stack direction='row' spacing={0} alignItems={'flex-start'} sx={{ width: '100%' }} key={entry._id}>
                        <Checkbox
                            checked={props.selection.includes(entry._id)}
                            onChange={() => handleToggleSelected(entry._id)}
                        />
                        <Grid container columns={12} spacing={1} sx={{ flex: '1', ml: 1 }}>
                            <Grid size={6}>
                                <span>preview here</span>
                            </Grid>
                            <Grid size={6}>
                                <Controller
                                    control={control}
                                    name={`artifacts.${index}.description`}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label='Description'
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <IconButton onClick={() => props.fieldArray.remove(index)}>
                            <Delete />
                        </IconButton>
                    </Stack>
                )
            })}
        </>
    )
}
