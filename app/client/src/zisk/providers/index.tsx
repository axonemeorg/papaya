import { CssBaseline, ThemeProvider } from '@mui/material'
import { PropsWithChildren } from 'react'
// import { montserrat } from '@/fonts/montserrat'
import appTheme from '@/components/theme/theme'
import CalculatorContextProvider from '@/providers/CalculatorContextProvider'
import JournalContextProvider from '@/providers/JournalContextProvider'
import NotificationsProvider from '@/providers/NotificationsProvider'
import PapayaContextProvider from '@/providers/PapayaContextProvider'
import RemoteContextProvider from '@/providers/RemoteContextProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface PapayaProviders extends PropsWithChildren {
  queryClient: QueryClient
}

export default function PapayaProviders(props: PapayaProviders) {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <main>
        <NotificationsProvider>
          <QueryClientProvider client={props.queryClient}>
            <PapayaContextProvider>
              <RemoteContextProvider>
                <JournalContextProvider>
                  <CalculatorContextProvider>{props.children}</CalculatorContextProvider>
                </JournalContextProvider>
              </RemoteContextProvider>
            </PapayaContextProvider>
          </QueryClientProvider>
        </NotificationsProvider>
      </main>
    </ThemeProvider>
  )
}
