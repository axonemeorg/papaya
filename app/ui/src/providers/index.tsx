import { CssBaseline, ThemeProvider } from '@mui/material'
import { PropsWithChildren } from 'react'
// import { montserrat } from '@ui/fonts/montserrat'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import appTheme from '@ui/components/theme/theme'
import CalculatorContextProvider from '@ui/providers/CalculatorContextProvider'
import JournalContextProvider from '@ui/providers/JournalContextProvider'
import NotificationsProvider from '@ui/providers/NotificationsProvider'
import RemoteContextProvider from '@ui/providers/RemoteContextProvider'
import ZiskContextProvider from '@ui/providers/ZiskContextProvider'

interface ZiskProviders extends PropsWithChildren {
  queryClient: QueryClient
}

export default function ZiskProviders(props: ZiskProviders) {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <main>
        <NotificationsProvider>
          <QueryClientProvider client={props.queryClient}>
            <ZiskContextProvider>
              <RemoteContextProvider>
                <JournalContextProvider>
                  <CalculatorContextProvider>{props.children}</CalculatorContextProvider>
                </JournalContextProvider>
              </RemoteContextProvider>
            </ZiskContextProvider>
          </QueryClientProvider>
        </NotificationsProvider>
      </main>
    </ThemeProvider>
  )
}
