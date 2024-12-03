'use client';

import { Avatar, Button, Chip, IconButton, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import AppLogo from "./AppLogo";
import { Menu, Search, Settings } from "@mui/icons-material";
import { useAppMenuStateStore } from "@/store/useAppMenuStateStore";
import { PropsWithChildren } from "react";
import JournalSelect from "./JournalSelect";
import SearchWidget from "./SearchWidget";
import SyncStatus from "./SyncStatus";
import UserWidget from "./UserWidget";

export default function Header() {
    const theme = useTheme();
    const showLogo = !useMediaQuery(theme.breakpoints.down('md'));

    // Get toggle menu function from zustand store
    const toggleOpen = useAppMenuStateStore((state) => state.toggleOpen);

    return (
        <Stack
            component='header'
            direction='row'
            gap={1}
            alignItems='center'
            justifyContent={'space-between'}
            sx={{
                py: 1,
                px: 1.5,
                color: 'inherit',
                textDecoration: 'none',
            }}
        >
            <Stack direction='row' gap={1} alignItems={'center'}>
                <IconButton onClick={() => toggleOpen()} size="large">
                    <Menu />
                </IconButton>
                {showLogo && (
                    <AppLogo />
                )}
                <Stack direction='row' alignItems='center' gap={1} ml={2}>
                    <JournalSelect />
                    <SyncStatus />
                </Stack>
            </Stack>
            <Stack direction='row' gap={1} alignItems={'center'}>
                <SearchWidget />
                <IconButton sx={(theme) => ({ color: theme.palette.text.secondary })}>
                    <Settings />
                </IconButton>
                <UserWidget />
            </Stack>
        </Stack>
    )    
}

// const Shortcut = (props: PropsWithChildren) => {
//     return (
//         <Typography component='kbd' sx={(theme) => {
//             return {
//                 // all: 'unset',
//                 // fontSize: theme.typography.pxToRem(12),
//                 fontWeight: 'bold',
//                 lineHeight: '19px',
//                 marginLeft: theme.spacing(0.5),
//                 border: `1px solid ${theme.palette.grey[200]}`,
//                 backgroundColor: theme.palette.background.paper,
//                 padding: theme.spacing(0, 0.5),
//                 borderRadius: 7,
//                 // ...theme.applyDarkStyles({
//                 //     borderColor: (theme).palette.primaryDark[600],
//                 //     backgroundColor: (theme).palette.primaryDark[800],
//                 // }),
//             };
//         }}>
//             {props.children}
//         </Typography>
//     )
// }
