import { Button } from '@mui/material'
import { importJournal } from '@ui/database/actions'
import { useFilePrompt } from '@ui/hooks/useFilePrompt'

export default function ImportJournalForm() {
  const promptForFiles = useFilePrompt()

  const handleOpen = async () => {
    const archive = (await promptForFiles(undefined, false)) as File

    await importJournal(archive)
  }

  return (
    <>
      <Button variant="contained" onClick={() => handleOpen()}>
        Import Journal
      </Button>
    </>
  )
}
