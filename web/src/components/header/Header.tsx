'use client';

import { Box, Breadcrumbs, Stack } from "@mui/material";
import BaseContainer from "../layout/BaseContainer";
import { PropsWithChildren } from "react";
import AppLogo from "./AppLogo";
import UserAvatarMenu from "./UserAvatarMenu";
import { User } from "lucia";
import AppNavMenu from "./AppNavMenu";

type HeaderProps = PropsWithChildren<{
    user: User;
}>;

export default function Header(props: HeaderProps) {
    return (
        <Box>
            <BaseContainer>
                <Stack
                    direction='row'
                    gap={8}
                    alignItems='center'
                    sx={{
                        py: 3,
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    <Breadcrumbs>
                        <AppLogo />
                        <AppNavMenu />
                    </Breadcrumbs>
                    <Stack direction='row' gap={1} alignItems='center' sx={{ flex: 1 }}>
                        {props.children}
                        <UserAvatarMenu user={props.user} />
                    </Stack>
                </Stack>
            </BaseContainer>
        </Box>
    )    
}
