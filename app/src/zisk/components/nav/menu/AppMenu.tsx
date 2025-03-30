import { APP_MENU, NavMenuItem } from '@/constants/menu'
import { useAppMenuStateStore } from '@/store/useAppMenuStateStore'
import { Add, Create, Menu } from '@mui/icons-material'
import {
	Box,
	Divider,
	Drawer,
	Fab,
	IconButton,
	ListItemIcon,
	ListItemText,
	MenuItem,
	MenuList,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material'
import { ReactNode, useContext, useEffect } from 'react'
import AppLogo from '../header/AppLogo'
import { JournalContext } from '@/contexts/JournalContext'
import useKeyboardAction from '@/hooks/useKeyboardAction'
import { KeyboardActionName } from '@/constants/keyboard'
import { Link } from '@tanstack/react-router'

interface AppMenuProps {
	view: 'desktop' | 'mobile'
}

interface CreateEntryButtonProps extends AppMenuProps {
	expanded: boolean
}

const CreateEntryButton = (props: CreateEntryButtonProps) => {
	const handleCreateEntry = () => {
		journalContext.createJournalEntry()
	}

	useKeyboardAction(KeyboardActionName.CREATE_JOURNAL_ENTRY, () => {
		handleCreateEntry();
	})

	const journalContext = useContext(JournalContext)
	if (props.view === 'mobile') {
		return (
			<Fab
				color="primary"
				aria-label="add"
				onClick={() => handleCreateEntry()}
				variant="extended"
				size="large"
				sx={(theme) => ({
					position: 'fixed',
					bottom: theme.spacing(4),
					right: theme.spacing(2),
				})}>
				<Add />
				Add
			</Fab>
		)
	}

	return (
		<Tooltip title="New Entry [C]" placement="right">
			<Fab
				color="primary"
				aria-label="add"
				onClick={() => handleCreateEntry()}
				variant={props.expanded ? 'extended' : 'circular'}
				size={props.expanded ? 'large' : 'medium'}
				sx={(theme) => ({
					mx: props.expanded ? 1.5 : -1,
					borderRadius: theme.spacing(2),
				})}>
				<Create sx={{ mr: props.expanded ? 1 : undefined }} />
				{props.expanded && <span>New Entry</span>}
			</Fab>
		</Tooltip>
	)
}

const LOCAL_STORAGE_KEY = 'ZISK_APP_MENU_OPEN_STATE'

export default function AppMenu(props: AppMenuProps) {
	const { view } = props
	const isExpanded = useAppMenuStateStore((state) => state.isExpanded)
	const isDrawerOpen = useAppMenuStateStore((state) => state.isDrawerOpen)
	const closeMenu = useAppMenuStateStore((state) => state.collapse)
	const openMenu = useAppMenuStateStore((state) => state.expand)
	const closeDrawer = useAppMenuStateStore((state) => state.closeDrawer)

	const pathname = ''

	useEffect(() => {
		const openState = localStorage.getItem(LOCAL_STORAGE_KEY)
		if (openState === 'true') {
			openMenu()
		} else {
			closeMenu()
		}
	}, [])

	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEY, isExpanded.toString())
	}, [isExpanded])

	useEffect(() => {
		closeDrawer()
	}, [pathname])

	const MenuItemList = ({ children }: { children?: ReactNode }) => {
		return (
			<MenuList component='nav' sx={(theme) => ({ pr: 2, minWidth: theme.spacing(24) })}>
				{children}
				{APP_MENU.map((menuItem: NavMenuItem) => {
					const selected = false
					return (
						<Link
							to={menuItem.to}
							key={menuItem.label}
							style={{ color: 'unset', textDecoration: 'none' }}
						>
							<MenuItem
								selected={selected}
								disabled={menuItem.disabled}
								sx={{ borderTopRightRadius: 32, borderBottomRightRadius: 32 }}>
								<ListItemIcon>{menuItem.icon}</ListItemIcon>
								<ListItemText>
									<Typography
										sx={{ fontWeight: selected ? 500 : undefined }}
										variant={props.view === 'desktop' ? 'body2' : 'body1'}>
										{menuItem.label}
									</Typography>
								</ListItemText>
							</MenuItem>
						</Link>
					)
				})}
			</MenuList>
		)
	}

	if (view === 'desktop') {
		if (isExpanded) {
			return (
				<MenuItemList>
					<Box mb={4}>
						<CreateEntryButton expanded view="desktop" />
					</Box>
				</MenuItemList>
			)
		} else {
			return (
				<Stack gap={0.5} px={2} py={1} alignItems={'center'}>
					<Box mb={2}>
						<CreateEntryButton expanded={false} view="desktop" />
					</Box>
					{APP_MENU.map((menuItem: NavMenuItem) => {
						const selected = false
						return (
							<Tooltip key={menuItem.to} title={menuItem.label} placement="right">
								<Link
									style={{ color: 'unset', textDecoration: 'none' }}
									to={menuItem.to}
								>
									<IconButton
										sx={(theme) => ({
											color: selected ? theme.palette.primary.main : theme.palette.text.secondary,
											backgroundColor: selected ? theme.palette.action.hover : undefined,
										})}
										disabled={menuItem.disabled}>
										{menuItem.icon}
									</IconButton>
								</Link>
							</Tooltip>
						)
					})}
				</Stack>
			)
		}
	} else {
		return (
			<>
				<CreateEntryButton expanded view="mobile" />
				<Drawer
					anchor="left"
					open={isDrawerOpen}
					onClose={() => closeDrawer()}
					PaperProps={{ sx: { minWidth: '80vw' } }}>
					<Box p={2}>
						<Stack direction="row" alignItems={'center'} gap={2}>
							<IconButton onClick={() => closeDrawer()} size="large" sx={{ m: -1 }}>
								<Menu />
							</IconButton>
							<AppLogo />
						</Stack>
					</Box>
					<Divider />
					<MenuItemList />
				</Drawer>
			</>
		)
	}
}
