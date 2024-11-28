import { ThemeProvider } from '@mui/material'
import { CssBaseline, Stack } from '@mui/material'
import appTheme from '@/components/theme/theme'
import { montserrat } from '@/fonts/montserrat'
import Head from 'next/head'
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NotificationsProvider from '@/providers/NotificationsProvider'

import '@/styles/main.scss'

const queryClient = new QueryClient();

function MyApp(props: any) {
  const { Component } = props;
  const { session, ...rest } = props.pageProps;

  return (
    <>
      <Head>
        <title>Zisk</title>
      </Head>
    
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <Stack component='main' id='root' minHeight='100dvh' className={montserrat.className}>
          <SessionProvider session={session}>
            <QueryClientProvider client={queryClient}>
              <NotificationsProvider>
                <Component {...rest} />
              </NotificationsProvider>
            </QueryClientProvider>
          </SessionProvider>
        </Stack>
      </ThemeProvider>
    </>
  )
}

export default MyApp
