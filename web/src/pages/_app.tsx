import { ThemeProvider } from '@mui/material'
import { CssBaseline, Stack } from '@mui/material'
import appTheme from '@/components/theme/theme'
import { montserrat } from '@/fonts/montserrat'
import Head from 'next/head'
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NotificationsProvider from '@/providers/NotificationsProvider'

// Imports styles
import '@/styles/main.scss'
import RemoteContextProvider from '@/providers/RemoteContextProvider'

const queryClient = new QueryClient();

function MyApp(props: any) {
	const { Component } = props;
	const { session, ...rest } = props.pageProps;

	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout ?? ((page: any) => page)

	return (
		<>
			<Head>
				<title>Zisk</title>
			</Head>

			<ThemeProvider theme={appTheme}>
				<CssBaseline />
				<main id='root' className={montserrat.className}>
					<SessionProvider session={session}>
						<RemoteContextProvider>
							<QueryClientProvider client={queryClient}>
								<NotificationsProvider>
									{getLayout(<Component {...rest} />)}
								</NotificationsProvider>
							</QueryClientProvider>
						</RemoteContextProvider>
					</SessionProvider>
				</main>
			</ThemeProvider>
		</>
	)
}

export default MyApp
