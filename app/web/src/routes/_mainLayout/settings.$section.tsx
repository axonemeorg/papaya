import { Container } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import ManageSettings, { SettingsTab } from '@zisk/ui/components/settings/ManageSettings'

export default function SettingsPage() {
  return (
    <Container maxWidth="md" disableGutters sx={{ pt: 1, pl: 1, pr: 3, mx: 2 }}>
      <ManageSettings />
    </Container>
  )
}

export const Route = createFileRoute('/_mainLayout/settings/$section')({
  component: SettingsPage,
  params: {
    parse: (params) => {
      const section = Object.values(SettingsTab).find((tab) => tab === params.section.toLowerCase()) as SettingsTab
      if (!section) throw Error(`"${params.section}" is not a valid section name.`)
      return { section }
    },
  },
})
