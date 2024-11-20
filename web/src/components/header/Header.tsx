'use client';

import { Box, Breadcrumbs, IconButton, Stack, useMediaQuery, useTheme } from "@mui/material";
import BaseContainer from "../layout/BaseContainer";
import { PropsWithChildren } from "react";
import AppLogo from "./AppLogo";
import UserAvatarMenu from "./UserAvatarMenu";
import { User } from "lucia";
import AppNavMenu from "./AppNavMenu";
import { Menu } from "@mui/icons-material";

type HeaderProps = PropsWithChildren<{
    user?: User;
}>;

export default function Header(props: HeaderProps) {
    const theme = useTheme();
    const hideLogo = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box>
            <BaseContainer>
                <Stack
                    direction='row'
                    gap={{
                        xs: 1,
                        md: 4,
                        lg: 8,
                    }}
                    alignItems='center'
                    sx={{
                        py: 3,
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    {hideLogo ? (
                        <IconButton>
                            <Menu />
                        </IconButton>
                    ) : (
                        <Breadcrumbs sx={{ 'ol': { flexWrap: 'nowrap' } }}>
                            <AppLogo />
                            <AppNavMenu />
                        </Breadcrumbs>
                    )}
                    <Stack direction='row' gap={1} alignItems='center' sx={{ flex: 1 }}>
                        {props.children}
                        {props.user && <UserAvatarMenu user={props.user} />}
                    </Stack>
                </Stack>
            </BaseContainer>
        </Box>
    )    
}
