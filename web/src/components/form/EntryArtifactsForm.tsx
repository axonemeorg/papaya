import { Checkbox, Grid2 as Grid, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material"
import { Delete, Download } from "@mui/icons-material"
import { AttachmentMeta, EntryArtifact, JournalEntry } from "@/types/schema"
import { Controller, UseFieldArrayReturn, useFormContext, useWatch } from "react-hook-form"
import FilePreview from "../file/FilePreview"
import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { getJournalEntryWithAttachments } from "@/database/queries"

interface EntryArtifactsFormProps {
    fieldArray: UseFieldArrayReturn<JournalEntry, "artifacts", "_id">
    selection: string[]
    onSelectionChange: (selection: string[]) => void
}

export default function EntryArtifactsForm(props: EntryArtifactsFormProps) {
    const { control } = useFormContext<JournalEntry>()
    const attachments = useWatch({ control, name: '_attachments' }) ?? {}
    const journalEntryId = useWatch({ control, name: '_id' })

    const handleToggleSelected = (artifactId: EntryArtifact['_id']) => {
        const isSelected = props.selection.includes(artifactId)
        if (isSelected) {
            props.onSelectionChange(props.selection.filter((id) => id !== artifactId))
        } else {
            props.onSelectionChange([...props.selection, artifactId])
        }
    }

    const handleDownloadFile = (file: File) => {
        const objectURL = URL.createObjectURL(file)
        window.open(objectURL)
    }

    return (
        <>
            {props.fieldArray.fields.map((artifact, index) => {
                const file = attachments[artifact._id]?.data

                return (
                    <Stack direction='row' spacing={0} alignItems={'flex-start'} sx={{ width: '100%' }} key={artifact._id}>
                        <Checkbox
                            checked={props.selection.includes(artifact._id)}
                            onChange={() => handleToggleSelected(artifact._id)}
                        />
                        <Grid container columns={12} spacing={1} sx={{ flex: '1', ml: 1 }}>
                            <Grid size={'auto'}>
                                <FilePreview file={file} />
                            </Grid>
                            <Grid size={'grow'}>
                                <Stack spacing={1}>
                                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                        <Typography>{artifact.originalFileName}</Typography>
                                        <Typography variant='body2'>{file?.size} bytes</Typography>
                                    </Stack>
                                    <Controller
                                        control={control}
                                        name={`artifacts.${index}.description`}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label='Description'
                                                fullWidth
                                            />
                                        )}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                        <Stack direction={'row'} spacing={-1} alignItems={'center'}>
                            <Tooltip title='Download'>
                                <IconButton onClick={() => handleDownloadFile(file)} color='primary'>
                                    <Download />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Delete'>
                                <IconButton onClick={() => props.fieldArray.remove(index)}>
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>
                )
            })}
        </>
    )
}
