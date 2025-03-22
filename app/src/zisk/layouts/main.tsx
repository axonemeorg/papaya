import Header from '@/components/nav/header/Header'
import AppMenu from '@/components/nav/menu/AppMenu'
import { ZiskUserThemeContext } from '@/contexts/UserThemeContext'
import { createTheme, Stack, ThemeOptions, ThemeProvider, useMediaQuery, useTheme } from '@mui/material'
import { CSSProperties, PropsWithChildren, useContext, useMemo } from 'react'

export default function MainLayout(props: PropsWithChildren) {
	const outerTheme = useTheme()
	const usingMobileMenu = useMediaQuery(outerTheme.breakpoints.down('sm'))

	const view = usingMobileMenu ? 'mobile' : 'desktop'

	const { activeTheme } = useContext(ZiskUserThemeContext)

	const innerTheme = useMemo(() => {
		if (!activeTheme) {
			return outerTheme
		}
		const theme: ThemeOptions = { ...outerTheme }

		if (activeTheme.primaryColor || activeTheme.secondaryColor) {
			theme.palette = outerTheme.palette ?? {}
			if (activeTheme.primaryColor) {
				theme.palette.primary = {
					...outerTheme.palette.primary,
					main: activeTheme.primaryColor
				}
			}
			if (activeTheme.secondaryColor) {
				theme.palette.secondary = {
					...outerTheme.palette.secondary,
					main: activeTheme.secondaryColor
				}
			}
		}
		if (activeTheme.background) {
			theme.components = outerTheme.components ?? {}
			theme.components.MuiPaper = {
				...outerTheme.components?.MuiPaper,
				styleOverrides: {
					...outerTheme.components?.MuiPaper?.styleOverrides,
					root: {
						...outerTheme.components?.MuiPaper?.styleOverrides?.root,
						backgroundColor: "rgba(255, 255, 255, 0.5)", // Transparent white
          				backdropFilter: "blur(2px)", // Adds a glassmorphism effect
					}
				}
			}
		}

		return createTheme(theme)
	}, [activeTheme])

	console.log('activeTheme:', activeTheme)

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
		<ThemeProvider theme={innerTheme}>
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
						<ThemeProvider theme={{ ...innerTheme, palette: { ...innerTheme.palette, mode: 'light' } }}>
							{props.children}
						</ThemeProvider>
					</Stack>
				</Stack>
			</Stack>
		</ThemeProvider>
	)
}
