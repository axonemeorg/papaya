import { Checkbox, Grid2 as Grid, IconButton, Stack, TextField } from "@mui/material"
import { Delete } from "@mui/icons-material"
import { EntryArtifact, JournalEntry } from "@/types/schema"
import { Controller, UseFieldArrayReturn, useFormContext, useWatch } from "react-hook-form"
import FilePreview from "../file/FilePreview"

interface EntryArtifactsFormProps {
    fieldArray: UseFieldArrayReturn<JournalEntry, "artifacts", "_id">
    selection: string[]
    onSelectionChange: (selection: string[]) => void
}

export default function EntryArtifactsForm(props: EntryArtifactsFormProps) {
    const { control } = useFormContext<JournalEntry>()
    const attachments = useWatch({ control, name: '_attachments' }) ?? {}

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
            {props.fieldArray.fields.map((artifact, index) => {
                console.log('artifact:', artifact)
                console.log('attachments:', attachments)
                console.log('attachments[artifact._id]:', attachments[artifact._id])
                return (
                    <Stack direction='row' spacing={0} alignItems={'flex-start'} sx={{ width: '100%' }} key={artifact._id}>
                        <Checkbox
                            checked={props.selection.includes(artifact._id)}
                            onChange={() => handleToggleSelected(artifact._id)}
                        />
                        <Grid container columns={12} spacing={1} sx={{ flex: '1', ml: 1 }}>
                            <Grid size={6}>
                                <FilePreview meta={attachments[artifact._id]} />
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
