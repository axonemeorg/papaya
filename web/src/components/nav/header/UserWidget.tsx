'use client'

import { Menu as MenuIcon } from "@mui/icons-material";
import { Avatar, Badge, Box, Button, Menu, MenuItem, Paper, Typography } from "@mui/material";
import { User } from "lucia";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

type UserWidgetProps = {};

export default function UserWidget(props: UserWidgetProps) {
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);

    const handleClose = () => {
        setAnchorEl(null);
    }

    
    const session = useSession();

    const isLoggedIn = session.data?.user ? true : false;
    
    const email = session.data?.user?.email;
    const image = session.data?.user?.image;
    const name = session.data?.user?.name;

    const handleSignIn = () => {
        signIn();
        // handleClose();
    }

    const handleSignOut = () => {
        signOut();
        // handleClose();
    }

    return (
        <>
            <Button sx={(theme) => ({ borderRadius: 56, ml: 1, color: theme.palette.grey[500] })} onClick={(event) => {
                setAnchorEl(event.currentTarget);
            }}>
                <MenuIcon sx={(theme) => ({ color: theme.palette.grey[500] })} />
                <Badge>
                    <Avatar
                        sx={(theme) => ({
                            background: theme.palette.background.paper,
                            outline: `2px solid ${theme.palette.divider}`,
                            ml: 1,
                            color: theme.palette.text.primary
                        })}
                        src={image ?? ''}
                    />
                </Badge>
            </Button>
            <Menu
                id='header-profile-menu'
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                MenuListProps={{
                    sx: { minWidth: 250 }
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorEl={anchorEl}
            >
                <Box component='li' sx={{ px: 2, pb: 1 }}>
                    <Typography variant='subtitle1'>
                        <strong>{name}</strong>
                    </Typography>
                    <Typography variant='body2'>
                        {email}
                    </Typography>
                </Box>
                {isLoggedIn ? (
                    <MenuItem onClick={() => handleSignOut()}>Sign Out</MenuItem>
                ) : (
                    <MenuItem onClick={() => handleSignIn()}>Sign In</MenuItem>
                )}
            </Menu>
        </>
    );
}
