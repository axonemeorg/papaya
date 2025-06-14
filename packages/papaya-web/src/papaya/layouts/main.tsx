import Header from '@/components/nav/header/Header'
import AppMenu from '@/components/nav/menu/AppMenu'
import { Container, Stack, useMediaQuery, useTheme } from '@mui/material'
import { PropsWithChildren } from 'react'

export default function MainLayout(props: PropsWithChildren) {
  const theme = useTheme()
  const usingMobileMenu = useMediaQuery(theme.breakpoints.down('sm'))

  const view = usingMobileMenu ? 'mobile' : 'desktop'

  return (
    <Stack
      component="main"
      sx={{
        height: '100dvh',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gridTemplateColumns: '1fr',
      }}
    >
      <Header view={view} />
      <Stack
        direction="row"
        sx={{
          gap: 0,
          minHeight: 0, // Allow flex item to shrink below content size
        }}
      >
        <AppMenu view={view} />
        <Container
          maxWidth="xl"
          disableGutters
          sx={{
            pt: 1,
            pl: 1,
            pr: 3,
            flex: 1, // Ensure container takes full width
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {props.children}
        </Container>
      </Stack>
    </Stack>
  )
}
