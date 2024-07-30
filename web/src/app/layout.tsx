import {
    Montserrat,
} from 'next/font/google'
import { CssBaseline, Stack, ThemeProvider } from '@mui/material'
import type { PropsWithChildren } from 'react'
import Header from '../components/header/Header'
import appTheme from '../components/theme/theme'
import BaseLayout from '../components/layout/BaseLayout'

import '@/styles/main.scss';

export const montserrat = Montserrat({ subsets: ['latin'] });

export default async (props: PropsWithChildren) => {
	return (
		<html
			lang='en'
			className={montserrat.className}
		>
			<head>
				<title>Zisk</title>
				<link rel="icon" href="favicon.ico" />
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/icon?family=Material+Icons"
				/>
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
