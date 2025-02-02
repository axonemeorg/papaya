import { Button, Checkbox, IconButton, InputBase, Link, Stack, Tooltip, Typography } from "@mui/material"
import { Add, CheckCircle, Delete, RadioButtonUnchecked } from "@mui/icons-material"
import { JournalEntry } from "@/types/schema"
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { useContext, useMemo } from "react"
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

    const activeTasks = useMemo(() => tasks?.filter(task => !task.completedAt), [tasks])
    const completedTasks = useMemo(() => tasks?.filter(task => task.completedAt), [tasks])

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
            <Stack mt={2} mx={-1} gap={0}>
                {entryTasksFieldArray.fields.map((task, index) => {

                    return (
                        <Stack direction='row' spacing={0} alignItems={'center'} sx={{ width: '100%' }} key={task._id}>
                            <Controller
                                control={control}
                                name={`tasks.${index}.completedAt`}
                                render={({ field }) => {
                                    return (
                                        <Checkbox
                                            checked={Boolean(field.value)}
                                            onChange={(event) => {
                                                setValue(`tasks.${index}.completedAt`, !event.target.checked ? null : new Date().toISOString())
                                            }}
                                            icon={<RadioButtonUnchecked />}
                                            checkedIcon={<CheckCircle />}
                                        />
                                    )
                                }}
                            />
                            <Controller
                                control={control}
                                name={`tasks.${index}.description`}
                                render={({ field }) => (
                                    <InputBase
                                        {...field}
                                        // variant='standard'
                                        size='small'
                                        autoFocus
                                        fullWidth
                                        slotProps={{
                                            input: {
                                                sx: { padding: 0 }
                                            }
                                        }}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault()
                                                handleAddTask()
                                            } else if (event.key === 'Backspace' && !field.value) {
                                                event.preventDefault()
                                                handleDeleteTask(index)
                                            }
                                        }}
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
