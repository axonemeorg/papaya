import { ThemeProvider } from '@mui/material'
import { CssBaseline, Stack } from '@mui/material'
import appTheme from '@/components/theme/theme'
import { montserrat } from '@/fonts/montserrat'
import '@/styles/main.scss'
import Head from 'next/head'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NotificationsProvider from '@/providers/NotificationsProvider'

const queryClient = new QueryClient();

function MyApp(props: any) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Zisk</title>
      </Head>
    
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <Stack component='main' id='root' minHeight='100dvh' className={montserrat.className}>
          <QueryClientProvider client={queryClient}>
            <NotificationsProvider>
              <Component {...pageProps} />
            </NotificationsProvider>
          </QueryClientProvider>
        </Stack>
      </ThemeProvider>
    </>
  )
}

export default MyApp
