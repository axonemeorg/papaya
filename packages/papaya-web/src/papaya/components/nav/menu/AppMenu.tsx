import { APP_MENU } from '@/constants/menu'
import { useOpenEntryEditModalForCreate } from '@/store/app/useJournalEntryEditModalState'
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
import { Link, useLocation } from '@tanstack/react-router'
import { ReactNode, useEffect } from 'react'
import AppLogo from '../header/AppLogo'

interface AppMenuProps {
  view: 'desktop' | 'mobile'
}

interface CreateEntryButtonProps extends AppMenuProps {
  expanded: boolean
}

const CreateEntryButton = (props: CreateEntryButtonProps) => {
  const openEntryEditModalForCreate = useOpenEntryEditModalForCreate()

  const handleCreateEntry = () => {
    openEntryEditModalForCreate()
  }

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

const LOCAL_STORAGE_KEY = 'PAPAYA_APP_MENU_OPEN_STATE'

export default function AppMenu(props: AppMenuProps) {
  const { view } = props
  const isExpanded = useAppMenuStateStore((state) => state.isExpanded)
  const isDrawerOpen = useAppMenuStateStore((state) => state.isDrawerOpen)
  const closeMenu = useAppMenuStateStore((state) => state.collapse)
  const openMenu = useAppMenuStateStore((state) => state.expand)
  const closeDrawer = useAppMenuStateStore((state) => state.closeDrawer)
  const location = useLocation();

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
  }, [location.pathname])

  const MenuItemList = ({ children }: { children?: ReactNode }) => {
    return (
      <MenuList sx={(theme) => ({ pr: 2, minWidth: theme.spacing(24) })}>
        {children}
        {Object.entries(APP_MENU).map(([slug, menuItem]) => {
          const selected = location.pathname.startsWith(slug);
          return (
            <MenuItem
              key={slug}
              component={Link}
              href={slug}
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
          {Object.entries(APP_MENU).map(([slug, menuItem]) => {
            const selected = location.pathname.startsWith(slug);
            return (
              <Tooltip key={slug} title={menuItem.label} placement="right">
                <IconButton
                  component={Link}
                  href={slug}
                  sx={(theme) => ({
                    color: selected ? theme.palette.primary.main : theme.palette.text.secondary,
                    backgroundColor: selected ? theme.palette.action.hover : undefined,
                  })}
                  disabled={menuItem.disabled}>
                  {menuItem.icon}
                </IconButton>
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
