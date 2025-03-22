import Header from '@/components/nav/header/Header'
import AppMenu from '@/components/nav/menu/AppMenu'
import { ZiskUserThemeContext } from '@/contexts/UserThemeContext'
import { createTheme, Stack, Theme, ThemeOptions, ThemeProvider, useMediaQuery, useTheme } from '@mui/material'
import { CSSProperties, PropsWithChildren, useContext, useMemo } from 'react'

export default function MainLayout(props: PropsWithChildren) {
	const globalTheme = useTheme()
	const usingMobileMenu = useMediaQuery(globalTheme.breakpoints.down('sm'))

	const view = usingMobileMenu ? 'mobile' : 'desktop'

	const { activeTheme } = useContext(ZiskUserThemeContext)

	const outerTheme = useMemo(() => {
		if (!activeTheme) {
			return globalTheme
		}
		const theme: ThemeOptions = { ...globalTheme }

		if (activeTheme.primaryColor || activeTheme.secondaryColor) {
			theme.palette = globalTheme.palette ?? {}
			if (activeTheme.primaryColor) {
				theme.palette.primary = {
					...globalTheme.palette.primary,
					main: activeTheme.primaryColor
				}
			}
			if (activeTheme.secondaryColor) {
				theme.palette.secondary = {
					...globalTheme.palette.secondary,
					main: activeTheme.secondaryColor
				}
			}
		}
		if (activeTheme.background) {
			theme.components = globalTheme.components ?? {}
			theme.components.MuiPaper = {
				...globalTheme.components?.MuiPaper,
				styleOverrides: {
					...globalTheme.components?.MuiPaper?.styleOverrides,
					root: {
						...globalTheme.components?.MuiPaper?.styleOverrides?.root,
						backgroundColor: "rgba(255, 255, 255, 0.75)", // Transparent white
          				backdropFilter: "blur(2px)", // Adds a glassmorphism effect
					}
				}
			}
		}

		return createTheme(theme)
	}, [activeTheme])

	const innerTheme = useMemo(() => {
		const theme: ThemeOptions = {
			...outerTheme,
			palette: {
				// ...outerTheme.palette,
				mode: 'light'
			}
		}

		return createTheme(theme)
	}, [outerTheme])

	console.log('activeTheme:', activeTheme)
	console.log('innerTheme:', innerTheme)

	let mainStyle: CSSProperties = {}
	if (activeTheme?.background && ('image' in activeTheme.background)) {
		mainStyle = {
			...mainStyle,
			backgroundImage: `url(${activeTheme.background.image})`,
			backgroundSize: 'cover',
			backgroundRepeat: 'no-repeat',
		}
		
	}

	return (
		<ThemeProvider theme={outerTheme}>
			<Stack
				component="main"
				sx={{
					minHeight: '100dvh',
					maxHeight: '100dvh',
				}}
				style={mainStyle}
			>
				<Header view={view} />
				<Stack direction="row" sx={{ flex: 1, gap: 0, overflow: 'hidden' }}>
					<AppMenu view={view} />
					<Stack
						sx={() => ({
							flex: 1,
						})}
					>
						<ThemeProvider
							// theme={{ ...outerTheme, palette: { ...outerTheme.palette, mode: 'light' } }}
							theme={innerTheme}
						>
							{props.children}
						</ThemeProvider>
					</Stack>
				</Stack>
			</Stack>
		</ThemeProvider>
	)
}
