'use client';

import { IconButton, Stack, useMediaQuery, useTheme } from "@mui/material";
import AppLogo from "./AppLogo";
import { Menu } from "@mui/icons-material";
import { useAppMenuStateStore } from "@/store/useAppMenuStateStore";

export default function Header() {
    const theme = useTheme();
    const showLogo = !useMediaQuery(theme.breakpoints.down('md'));

    // Get toggle menu function from zustand store
    const toggleOpen = useAppMenuStateStore((state) => state.toggleOpen);

    return (
        <Stack
            direction='row'
            gap={1}
            alignItems='center'
            sx={{
                py: 1,
                px: 1.5,
                color: 'inherit',
                textDecoration: 'none',
            }}
        >
            <IconButton onClick={() => toggleOpen()} size="large">
                <Menu />
            </IconButton>
            {showLogo && (
                <AppLogo />
            )}
        </Stack>
    )    
}
