'use client';

import { Avatar, Box, Stack } from "@mui/material";
import HeaderBreadcrumbs from "./HeaderBreadcrumbs";
import BaseContainer from "../layout/BaseContainer";
import HeaderTabs from "./HeaderTabs";
import { PropsWithChildren } from "react";
import AppLogo from "./AppLogo";

/**
 * Header component used by the app
 */
export default function Header(props: PropsWithChildren) {
    return (
        <Box>
            <BaseContainer>
                <Stack
                    direction='row'
                    gap={1}
                    alignItems='center'
                    sx={{
                        py: 3,
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    {/* <HeaderBreadcrumbs /> */}
                    <AppLogo />
                    {props.children}
                    <Avatar />
                </Stack>
            </BaseContainer>
        </Box>
    )    
}
