'use server'

import { CssBaseline, Stack, ThemeProvider } from '@mui/material'
import type { PropsWithChildren } from 'react'
import Header from '../components/header/Header'
import appTheme from '../components/theme/theme'
import BaseLayout from '../components/layout/BaseLayout'

/**
 * The base layout for the application. With the Next.js app router, this
 * includes not only shared layout code, but also metadata tags used for the
 * HTML document. Notably, this layout imports fonts from Google Fonts.
 */
export default async (props: PropsWithChildren) => {
	return (
		<html lang='en'>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap"
				/>
				<title>Zisk</title>
				<link rel="icon" href="favicon.ico" />
			</head>
			<body>
				<ThemeProvider theme={appTheme}>
						<CssBaseline />
						<Stack component='main' id='root' minHeight='100vh'>
							<Header />
							<BaseLayout>
								{props.children}
							</BaseLayout>
						</Stack>
				</ThemeProvider>
			</body>
		</html>
	)
}
