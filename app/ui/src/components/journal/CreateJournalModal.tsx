import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material'
import { createJournal } from '@ui/database/actions'
import { useAddJournal } from '@ui/hooks/queries/useJournals'
import { CreateJournal, Journal } from '@ui/schema/documents/Journal'
import { useEffect } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import ImportJournalForm from '../form/ImportJournalForm'
import AvatarPicker, { DEFAULT_AVATAR } from '../pickers/AvatarPicker'

interface CreateJournalModalProps {
  open: boolean
  onClose: () => void
  onCreated: (newJournal: Journal) => void
}

const DEFAULT_JOURNAL_AVATAR = {
  ...DEFAULT_AVATAR,
}

export default function CreateJournalModal(props: CreateJournalModalProps) {
  const addJournal = useAddJournal()

  const createJournalForm = useForm<CreateJournal>({
    defaultValues: {
      avatar: {
        ...DEFAULT_JOURNAL_AVATAR,
      },
      journalName: '',
    },
    resolver: zodResolver(CreateJournal),
  })

  const handleSubmit = async (formData: CreateJournal) => {
    // Create a new journal
    const newJournal: Journal = await createJournal({
      ...formData,
    })

    addJournal(newJournal)
    props.onClose()
    props.onCreated(newJournal)
  }

  useEffect(() => {
    if (!props.open) {
      createJournalForm.reset()
    }
  }, [props.open])

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <FormProvider {...createJournalForm}>
        <form onSubmit={createJournalForm.handleSubmit(handleSubmit)}>
          <DialogTitle>Create a Journal</DialogTitle>
          <DialogContent sx={{ overflow: 'initial' }}>
            <Stack direction="row" spacing={1} mb={2}>
              <Controller
                name="avatar"
                render={({ field }) => <AvatarPicker value={field.value} onChange={field.onChange} />}
                control={createJournalForm.control}
              />
              <TextField {...createJournalForm.register('journalName')} fullWidth label="Journal name" />
            </Stack>
            <ImportJournalForm />
          </DialogContent>
          <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button variant="contained" type="submit">
              Create Journal
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  )
}
