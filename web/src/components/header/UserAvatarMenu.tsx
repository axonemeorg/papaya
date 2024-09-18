'use client'

import { logout } from "@/actions/auth-actions";
import { validateRequest } from "@/auth";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Avatar, Badge, Button, Menu, MenuItem, Paper } from "@mui/material";
import { User } from "lucia";
import Link from "next/link";
import { useState } from "react";

interface UserAvatarMenuProps {
    user: User | null;
}

export default function UserAvatarMenu(props: UserAvatarMenuProps) {
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);

    const handleClose = () => {
        setAnchorEl(null);
    }

    const initials = props.user?.username?.slice(0, 1)?.toUpperCase?.() ?? undefined;

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
                    >
                        {initials}
                    </Avatar>
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
                <MenuItem component={Link} href='/settings'>
                    Settings
                </MenuItem>
                <form action={logout}>
                    <MenuItem component={'button'} sx={{ width: '100%' }} type='submit'>
                        Logout
                    </MenuItem>
                    </form>
            </Menu>
        </>
    );
}
