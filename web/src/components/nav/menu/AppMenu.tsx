import { APP_MENU } from "@/constants/menu";
import { useAppMenuStateStore } from "@/store/useAppMenuStateStore";
import { Add, Create } from "@mui/icons-material";
import { Fab, IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Stack } from "@mui/material";
import { useEffect } from "react";

interface AppMenuProps {
    view: 'desktop' | 'mobile';
}

interface CreateEntryButtonProps {
    expanded: boolean;
}

const CreateEntryButton = (props: CreateEntryButtonProps) => {
    return (
        <Fab
            color='primary'
            aria-label='add'
            // onClick={() => setShowJournalEntryModal(true)}
            variant={props.expanded ? 'extended' : 'circular'}
            size={props.expanded ? 'large' : 'medium'}
            sx={(theme) => ({
                mx: props.expanded ? 1.5 : -1,
                mb: 2,
                borderRadius: theme.spacing(2),
            })}
        >
            <Create sx={{ mr: props.expanded ? 1 : undefined }} />
            {props.expanded && (
                <span>New Entry</span>
            )}
        </Fab>
    )
}

const LOCAL_STORAGE_KEY = "ZISK_APP_MENU_OPEN_STATE";
const DEFAULT_OPEN_STATE = true;

export default function AppMenu(props: AppMenuProps) {
    const { view } = props;
    const isOpen = useAppMenuStateStore((state) => state.isOpen);
    const closeMenu = useAppMenuStateStore((state) => state.close);
    const openMenu = useAppMenuStateStore((state) => state.open);

    useEffect(() => {
        const openState = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (openState === 'true') {
            openMenu();
        } else {
            closeMenu();
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, isOpen.toString());
    }, [isOpen]);

    if (isOpen && view === 'desktop') {
        return (
            <MenuList sx={(theme) => ({ pr: 3, minWidth: theme.spacing(24) })}>
                <CreateEntryButton expanded />
                {Object.entries(APP_MENU).map(([slug, menuItem]) => {
                    return (
                        <MenuItem
                            key={slug}
                            selected={slug === '/journal'}
                            disabled={menuItem.disabled}
                            sx={{ borderTopRightRadius: 32, borderBottomRightRadius: 32 }}
                        >
                            <ListItemIcon>
                                {menuItem.icon}
                            </ListItemIcon>
                            {isOpen && (
                                <ListItemText
                                    primary={menuItem.label}
                                    // secondary={menuItem.description}
                                />
                            )}
                        </MenuItem>
                    );
                })}            
            </MenuList>
        );
    }

    if (!isOpen && view === 'desktop') {
        return (
            <Stack gap={0.5} px={2} py={1} alignItems={'center'}>
                <CreateEntryButton expanded={false} />
                {Object.entries(APP_MENU).map(([slug, menuItem]) => {
                    const selected = slug === '/journal';
                    return (
                        <IconButton
                            sx={(theme) => ({
                                color: selected ? theme.palette.primary.main : theme.palette.text.secondary,
                                backgroundColor: selected ? theme.palette.action.hover : undefined,
                            })}
                            key={slug}
                            // onClick={() => menuItem.onClick()}
                            disabled={menuItem.disabled}
                            
                        >
                            {menuItem.icon}
                        </IconButton>
                    );
                })}
            </Stack>
        )
    }
}
