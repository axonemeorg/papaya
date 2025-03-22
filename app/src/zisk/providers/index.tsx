
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NotificationsProvider from '@/providers/NotificationsProvider'
import JournalContextProvider from '@/providers/JournalContextProvider'
import ZiskContextProvider from '@/providers/ZiskContextProvider'
import RemoteContextProvider from '@/providers/RemoteContextProvider'
import CalculatorContextProvider from '@/providers/CalculatorContextProvider'
import ZiskThemeProvider from "./ZiskThemeContextProvider";

interface ZiskProviders extends PropsWithChildren {
    queryClient: QueryClient
}

export default function ZiskProviders(props: ZiskProviders) {
    return (
        <NotificationsProvider>
            <QueryClientProvider client={props.queryClient}>
                <ZiskContextProvider>
                    <RemoteContextProvider>
                        <JournalContextProvider>
                            <ZiskThemeProvider>
                                <CalculatorContextProvider>
                                    {props.children}
                                </CalculatorContextProvider>
                            </ZiskThemeProvider>
                        </JournalContextProvider>
                    </RemoteContextProvider>
                </ZiskContextProvider>
            </QueryClientProvider>
        </NotificationsProvider>
    )
}