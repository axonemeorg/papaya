'use client';

import { Box, Breadcrumbs, IconButton, Stack, useMediaQuery, useTheme } from "@mui/material";
import BaseContainer from "../layout/BaseContainer";
import { PropsWithChildren, useState } from "react";
import AppLogo from "./AppLogo";
import { User } from "lucia";
import { Menu } from "@mui/icons-material";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const theme = useTheme();
    const showLogo = !useMediaQuery(theme.breakpoints.down('md'));

    const toggleMenuOpen = () => {
        setMenuOpen((prev) => !prev);
    }

    return (
        <Box>
            <Stack
                direction='row'
                gap={1}
                alignItems='center'
                sx={{
                    py: 1,
                    px: 2,
                    color: 'inherit',
                    textDecoration: 'none',
                }}
            >
                <IconButton onClick={() => toggleMenuOpen()} size="large">
                    <Menu />
                </IconButton>
                {showLogo && (
                    <AppLogo />
                )}
            </Stack>
        </Box>
    )    
}
