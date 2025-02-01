import { Button, Checkbox, Grid2 as Grid, IconButton, Link, Stack, TextField, Tooltip, Typography } from "@mui/material"
import { Add, Delete } from "@mui/icons-material"
import { JournalEntry } from "@/types/schema"
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { useContext } from "react"
import { JournalContext } from "@/contexts/JournalContext"
import { makeEntryTask } from "@/utils/journal"

export default function EntryTasksForm() {
    const journalContext = useContext(JournalContext)

    const { setValue, control } = useFormContext<JournalEntry>()
    const tasks = useWatch({ control, name: 'tasks' })
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

    const handleDeleteTask = (index: number) => {
        entryTasksFieldArray.remove(index)
    }

    const handleToggleCompleted = (taskId: string) => {
        //
    }

    return (
        <>
            <Stack direction='row' alignItems={'center'} justifyContent={'space-between'} mt={2} mx={-2} px={2}>
                <Typography>Tasks ({tasks?.length ?? 0})</Typography>
                <Button onClick={() => handleAddTask()} startIcon={<Add />}>Add Task</Button>
            </Stack>
            {!tasks?.length && (
                <Typography variant='body2' color='textSecondary'>
                    No tasks. <Link onClick={() => handleAddTask()}>Click to add one.</Link>
                </Typography>
            )}
            <Stack mt={2} mx={-1} spacing={1}>
                {entryTasksFieldArray.fields.map((task, index) => {

                    return (
                        <Stack direction='row' spacing={0} alignItems={'center'} sx={{ width: '100%' }} key={task._id}>
                            <Checkbox
                                checked={Boolean(task.completedAt)}
                                onChange={() => handleToggleCompleted(task._id)}
                            />
                            <Controller
                                key={task._id}
                                control={control}
                                name={`tasks.${index}.description`}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        variant='standard'
                                        size='small'
                                        autoFocus

                                        // onChange={(event) => {
                                        //     console.log('event.target.value:', event.target.value)
                                        //     console.log('field.value:', field.value)
                                        //     if (!event.target.value && !field.value) {
                                        //         alert('delete me')
                                        //     }
                                        //     field.onChange(event)
                                        // }}

                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault()
                                                handleAddTask()
                                            } else if (event.key === 'Backspace' && !field.value) {
                                                event.preventDefault()
                                                handleDeleteTask(index)
                                            }
                                        }}
                                        fullWidth
                                    />
                                )}
                            />
                            <Stack direction={'row'} spacing={-1} alignItems={'center'}>
                                <Tooltip title='Delete'>
                                    <IconButton onClick={() => handleDeleteTask(index)}>
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Stack>
                    )
                })}
            </Stack>
        </>
    )
}
