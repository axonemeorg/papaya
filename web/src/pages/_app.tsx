import { ThemeProvider } from '@mui/material'
import { CssBaseline, Stack } from '@mui/material'
import appTheme from '@/components/theme/theme'
import { montserrat } from '@/fonts/montserrat'
import '@/styles/main.scss'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Stack component='main' id='root' minHeight='100dvh' className={montserrat.className}>
        <Component {...pageProps} />
      </Stack>
    </ThemeProvider>
  )
}

export default MyApp
