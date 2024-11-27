import { ThemeProvider } from '@mui/material'
import { CssBaseline, Stack } from '@mui/material'
import appTheme from '@/components/theme/theme'
import { montserrat } from '@/fonts/montserrat'
import Head from 'next/head'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NotificationsProvider from '@/providers/NotificationsProvider'

// Imports styles
import '@/styles/main.scss'

const queryClient = new QueryClient();

function MyApp(props: any) {
  const { Component, pageProps } = props;

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page: any) => page)

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
              {getLayout(<Component {...pageProps} />)}
            </NotificationsProvider>
          </QueryClientProvider>
        </Stack>
      </ThemeProvider>
    </>
  )
}

export default MyApp
