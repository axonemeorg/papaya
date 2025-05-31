import { Stack, useMediaQuery, useTheme } from '@mui/material'
import Header from '@ui/components/nav/header/Header'
import AppMenu from '@ui/components/nav/menu/AppMenu'
import { PropsWithChildren } from 'react'

export default function MainLayout(props: PropsWithChildren) {
  const theme = useTheme()
  const usingMobileMenu = useMediaQuery(theme.breakpoints.down('sm'))

  const view = usingMobileMenu ? 'mobile' : 'desktop'

  return (
    <Stack component="main" sx={{ minHeight: '100dvh', maxHeight: '100dvh' }}>
      <Header view={view} />
      <Stack direction="row" sx={{ gap: 0, overflow: 'hidden', flex: 1 }}>
        <AppMenu view={view} />
        {props.children}
      </Stack>
    </Stack>
  )
}
