
import { ThemeProvider } from '@mui/material'
import { PropsWithChildren } from "react";
import { CssBaseline } from '@mui/material'
// import { montserrat } from '@/fonts/montserrat'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NotificationsProvider from '@/providers/NotificationsProvider'
import appTheme from '@/components/theme/theme'
import JournalContextProvider from '@/providers/JournalContextProvider'
import ZiskContextProvider from '@/providers/ZiskContextProvider'
import RemoteContextProvider from '@/providers/RemoteContextProvider'
import CalculatorContextProvider from '@/providers/CalculatorContextProvider'

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
                                    <CalculatorContextProvider>
                                        {props.children}
                                    </CalculatorContextProvider>
                                </JournalContextProvider>
                            </RemoteContextProvider>
                        </ZiskContextProvider>
                    </QueryClientProvider>
                </NotificationsProvider>
            </main>
        </ThemeProvider>
    )
}