import RadioToggleButton from '@/components/input/RadioToggleButton'
import { Container, Stack, ToggleButtonGroup, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/_welcomeLayout/welcome/getting-started')({
  component: GettingStarted,
})

function GettingStarted() {
  const [value, setValue] = useState<'new' | 'import' | 'start' | 'demo'>('new')

  const handleChange = (event: React.MouseEvent<HTMLElement>, newValue: string) => {
    setValue(newValue as 'new' | 'import' | 'start' | 'demo')
  }

  return (
    <Container maxWidth='sm'>

      <Stack gap={4}>
        <Stack gap={2}>
          <Typography variant='h5'>Get started with Papaya</Typography>
          <Typography variant='body2'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
          </Typography>
        </Stack>
        <Stack>
          <ToggleButtonGroup exclusive value={value} onChange={handleChange} orientation='vertical'>
            <RadioToggleButton value='new' heading='Set up a new journal' description='Create a new journal to get started' />
            <RadioToggleButton value='import' heading='Import existing data from my Papaya Server' description='Import your existing data from your Papaya Server' />
          </ToggleButtonGroup>
          <Typography variant='body2' sx={{ pt: 3, pb: 2 }}>Other options</Typography>
          <ToggleButtonGroup exclusive value={value} onChange={handleChange} orientation='vertical'>
            <RadioToggleButton value='start' heading='Start using Papaya from scratch' description='Start using Papaya from scratch' />
            <RadioToggleButton value='demo' heading='Demo mode' description='Use Papaya in demo mode' />
          </ToggleButtonGroup>
        </Stack>
      </Stack>
    </Container>
  )
}
