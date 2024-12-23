import { Checkbox, Grid2 as Grid, IconButton, Stack } from "@mui/material"
import AmountField from "../input/AmountField"
import CategoryAutocomplete from "../input/CategoryAutocomplete"
import { Delete, Flag, FlagOutlined } from "@mui/icons-material"
import { ChangeEvent } from "react"
import { JournalEntry } from "@/types/schema"
import { Controller, UseFieldArrayReturn, useFormContext } from "react-hook-form"

interface ChildJournalEntryFormProps {
    fieldArray: UseFieldArrayReturn<JournalEntry, "children", "_id">
    selection: string[]
    onSelectionChange: (selection: string[]) => void
}

export default function ChildJournalEntryForm(props: ChildJournalEntryFormProps) {
    const isFlagged = false
    const handleToggleFlagged = (event: ChangeEvent<HTMLInputElement>) => {
        const _flagged = event.target.checked
        
    }

    const { control } = useFormContext<JournalEntry>()
	// const journalContext = useContext(JournalContext)

    const handleToggleSelected = (entryId: JournalEntry['_id']) => {
        const isSelected = props.selection.includes(entryId)
        if (isSelected) {
            props.onSelectionChange(props.selection.filter((id) => id !== entryId))
        } else {
            props.onSelectionChange([...props.selection, entryId])
        }
    }

    return (
        <>
            {props.fieldArray.fields.map((entry, index) => {
                return (
                    <Stack direction='row' spacing={0} alignItems={'flex-start'} sx={{ width: '100%' }} key={entry._id}>
                        <Stack direction='row' spacing={-1}>
                            <Checkbox
                                checked={props.selection.includes(entry._id)}
                                onChange={() => handleToggleSelected(entry._id)}
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
                                {/* <AmountField
                                    size='small'
                                    {...register(`children.${index}.amount`)}
                                    name={`children.${index}.amount`}
                                /> */}
                                <Controller
                                    control={control}
                                    name={`children.${index}.amount`}
                                    render={({ field }) => (
                                        <AmountField
                                            // variant='filled'
                                            {...field}
                                            // fullWidth
                                            // sx={{ flex: 1 }}
                                            // autoComplete="off"
                                            size="small"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={6}>
                                <CategoryAutocomplete
                                    size='small'
                                    value={entry.categoryIds}
                                    onChange={(_event, newValue) => {
                                        if (newValue) {
                                            props.fieldArray.update(index, { ...entry, categoryIds: newValue })
                                        }
                                    }}
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
