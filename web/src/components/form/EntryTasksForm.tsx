import { Button, Checkbox, IconButton, InputBase, Link, Stack, Tooltip, Typography } from "@mui/material"
import { Add, AddTask, CheckCircle, Delete, RadioButtonUnchecked } from "@mui/icons-material"
import { EntryTask, JournalEntry } from "@/types/schema"
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { useContext } from "react"
import { JournalContext } from "@/contexts/JournalContext"
import { makeEntryTask } from "@/utils/journal"

export default function EntryTasksForm() {
    const journalContext = useContext(JournalContext)

    const { setValue, control } = useFormContext<JournalEntry>()
    const tasks: EntryTask[] | undefined = useWatch({ control, name: 'tasks' })
	const entryTasksFieldArray = useFieldArray({
		control,
		name: 'tasks',
	})

    const handleAddTask = async () => {
		if (!journalContext.journal) {
			return
		}
        
        const journalId = journalContext.journal._id
        const newTask = makeEntryTask({}, journalId)

		if (tasks) {
			entryTasksFieldArray.append(newTask)
		} else {
			setValue('tasks', [newTask])
		}
	}

    return (
        <Stack gap={0.5}>
            <Button
                component='a'
                onClick={() => handleAddTask()}
                sx={(theme) => ({
                    mx: -1,
                    mt: -2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left',
                    color: 'inherit',
                    '&:hover, &:focus, &:focus-within, &.--open': {
                        color: theme.palette.primary.main
                    },
                    background: 'none',
                })}
                disableRipple
                tabIndex={-1}
            >
                <Typography component='span' variant='body2' sx={{ fontWeight: 500 }}>Tags</Typography>
                <IconButton sx={{ m: -1, color: 'inherit' }} disableTouchRipple>
                    <AddTask />
                </IconButton>
            </Button>
            {entryTasksFieldArray.fields.length === 0 ? (
                <Typography sx={{ mt: -1 }} variant='body2' color='textSecondary'>
                    <span>No tags — </span>
                    <Link onClick={() => handleAddTask()}>Add one</Link>
                </Typography>
            ) : (
                <Stack mt={0} ml={-1} mr={1} gap={0}>
                    {entryTasksFieldArray.fields.map((task, index) => {{
                        return (
                            <Stack direction='row' spacing={0} alignItems={'center'} sx={{ width: '100%' }} key={task._id}>
                                <Controller
                                    control={control}
                                    name={`tasks.${index}.completedAt`}
                                    render={({ field: { value, onChange } }) => (
                                        <Checkbox
                                            checked={Boolean(value)}
                                            onChange={(event) => {
                                                onChange(event.target.checked ? new Date().toISOString() : null)
                                            }}
                                            icon={<RadioButtonUnchecked />}
                                            checkedIcon={<CheckCircle />}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={`tasks.${index}.description`}
                                    render={({ field: { value, onChange, ...rest } }) => (
                                        <InputBase
                                            value={value}
                                            onChange={onChange}
                                            {...rest}
                                            placeholder='Task...'
                                            size='small'
                                            fullWidth
                                            sx={{ 
                                                textDecoration: tasks?.[index]?.completedAt ? 'line-through' : 'none'
                                            }}
                                        />
                                    )}
                                />
                                {/* <Tooltip title='Delete'>
                                    <IconButton onClick={() => entryTasksFieldArray.remove(index)}>
                                        <Delete />
                                    </IconButton>
                                </Tooltip> */}
                            </Stack>
                        )
                    }})}
                </Stack>
            )}
                
        </Stack>
    )
}
