import { APP_MENU } from "@/constants/menu";
import { useAppMenuStateStore } from "@/store/useAppMenuStateStore";
import { Add, Create } from "@mui/icons-material";
import { Box, Fab, IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
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

export default function AppMenu(props: AppMenuProps) {
    const { view } = props;
    const isExpanded = useAppMenuStateStore((state) => state.isExpanded);
    const closeMenu = useAppMenuStateStore((state) => state.close);
    const openMenu = useAppMenuStateStore((state) => state.open);

    const router = useRouter();
    const pathname = router.pathname;

    useEffect(() => {
        const openState = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (openState === 'true') {
            openMenu();
        } else {
            closeMenu();
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, isExpanded.toString());
    }, [isExpanded]);

    if (isExpanded && view === 'desktop') {
        return (
            <MenuList sx={(theme) => ({ pr: 3, minWidth: theme.spacing(24) })}>
                <Box mb={4}>
                    <CreateEntryButton expanded />
                </Box>
                {Object.entries(APP_MENU).map(([slug, menuItem]) => {
                    const selected = menuItem.pathPattern.test(pathname);
                    return (
                        <MenuItem
                            key={slug}
                            component={Link}
                            href={slug}
                            selected={selected}
                            disabled={menuItem.disabled}
                            sx={{ borderTopRightRadius: 32, borderBottomRightRadius: 32 }}
                        >
                            <ListItemIcon>
                                {menuItem.icon}
                            </ListItemIcon>
                            {isExpanded && (
                                <ListItemText>
                                    <Typography sx={{ fontWeight: selected ? 500 : undefined }} variant='body2'>
                                        {menuItem.label}
                                    </Typography>
                                </ListItemText>
                            )}
                        </MenuItem>
                    );
                })}            
            </MenuList>
        );
    }

    if (!isExpanded && view === 'desktop') {
        return (
            <Stack gap={0.5} px={2} py={1} alignItems={'center'}>
                <Box mb={2}>
                    <CreateEntryButton expanded={false} />
                </Box>
                {Object.entries(APP_MENU).map(([slug, menuItem]) => {
                    const selected = menuItem.pathPattern.test(pathname);
                    return (
                        <IconButton
                            key={slug}
                            component={Link}
                            href={slug}
                            sx={(theme) => ({
                                color: selected ? theme.palette.primary.main : theme.palette.text.secondary,
                                backgroundColor: selected ? theme.palette.action.hover : undefined,
                            })}
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
