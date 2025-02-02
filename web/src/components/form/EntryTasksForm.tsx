import { Button, Checkbox, Collapse, IconButton, InputBase, Link, Stack, Tooltip, Typography } from "@mui/material"
import { Add, CheckCircle, ChevronRight, Delete, ExpandMore, RadioButtonUnchecked } from "@mui/icons-material"
import { EntryTask, JournalEntry } from "@/types/schema"
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { useCallback, useContext, useMemo, useState } from "react"
import { JournalContext } from "@/contexts/JournalContext"
import { makeEntryTask } from "@/utils/journal"
import { pluralize } from "@/utils/string"

export default function EntryTasksForm() {
    const journalContext = useContext(JournalContext)
    const [showCompleted, setShowCompleted] = useState<boolean>(false)

    const { setValue, control } = useFormContext<JournalEntry>()
    const tasks = useWatch({ control, name: 'tasks' })
	const entryTasksFieldArray = useFieldArray({
		control,
		name: 'tasks',
	})

    const activeTasks = useMemo(() => tasks?.filter(task => !task.completedAt), [tasks])
    const completedTasks = useMemo(() => tasks?.filter(task => task.completedAt), [tasks])

    const renderTaskList = useCallback((taskList: EntryTask[], isCompleted: boolean) => (
        <>
            {taskList.map((task, index) => (
                <Stack direction='row' spacing={0} alignItems={'center'} sx={{ width: '100%', opacity: isCompleted ? 0.6 : 1 }} key={task._id}>
                    <Controller
                        control={control}
                        name={`tasks.${index}.completedAt`}
                        render={({ field }) => (
                            <Checkbox
                                checked={Boolean(field.value)}
                                onChange={(event) => {
                                    setValue(`tasks.${index}.completedAt`, !event.target.checked ? null : new Date().toISOString());
                                }}
                                icon={<RadioButtonUnchecked />}
                                checkedIcon={<CheckCircle />}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name={`tasks.${index}.description`}
                        render={({ field }) => (
                            <InputBase
                                {...field}
                                size='small'
                                fullWidth
                                sx={{ textDecoration: isCompleted ? 'line-through' : 'none' }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault();
                                        handleAddTask();
                                    } else if (event.key === 'Backspace' && !field.value) {
                                        event.preventDefault();
                                        handleDeleteTask(index);
                                    }
                                }}
                            />
                        )}
                    />
                    <Tooltip title='Delete'>
                        <IconButton onClick={() => handleDeleteTask(index)}>
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </Stack>
            ))}
        </>
    ), [control, setValue, tasks]);

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
            {(activeTasks?.length ?? 0) > 0 && (
                <Stack mt={0} mx={-1} gap={0}>
                    {renderTaskList(activeTasks ?? [], false)}
                </Stack>
            )}
            {(completedTasks?.length ?? 0) > 0 && (
                <>
                    <Button
                        startIcon={showCompleted ? <ExpandMore /> : <ChevronRight />}
                        onClick={() => setShowCompleted((prev) => !prev)}
                    >
                        {completedTasks?.length} {pluralize(completedTasks?.length ?? 0, 'Completed task')}
                    </Button>
                    <Collapse in={showCompleted}>
                        <Stack mt={0} mx={-1} gap={0}>
                            {renderTaskList(completedTasks ?? [], true)}
                        </Stack>
                    </Collapse>
                </>
            )}
        </>
    )
}
