'use client'

import { validateRequest } from "@/auth";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Avatar, Badge, Button, Menu, MenuItem } from "@mui/material";
import { User } from "lucia";
import { useState } from "react";

interface UserAvatarMenuProps {
    user: User | null;
}

export default function UserAvatarMenu(props: UserAvatarMenuProps) {
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleLogout = () => {
        // return logout();
    }

    console.log('props!', props)
    

    return (
        <>
            <Button sx={{ borderRadius: 56 }} onClick={(event) => {
                setAnchorEl(event.currentTarget);
            }}>
                <MenuIcon />
                <Badge>
                    <Avatar sx={(theme) => ({ background: theme.palette.common.black, ml: 1 })}>
                        {'HW'}
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
                {/* <MenuItem onClick={handleLogout}>
                    Logout
                </MenuItem> */}
            </Menu>
        </>
    );
}
