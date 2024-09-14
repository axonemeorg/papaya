'use client';

import { Insights, ReceiptLong, UnfoldMore } from "@mui/icons-material";
import { Button, ListItemIcon, ListItemText, MenuItem as MuiMenuItem, MenuItemProps, Select } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

type MenuItem = {
    icon: ReactNode;
    title: string;
    description: string;
    disabled?: boolean;
};

const menuItems: Record<string, MenuItem> = {
    '/journal': {
        icon: <ReceiptLong />,
        title: 'Journal',
        description: 'Organize your expenses',
    },
    '/analyze': {
        icon: <Insights />,
        title: 'Analyze',
        description: 'Understand your spending',
        disabled: true,
    },
};

const MenuItem = (props: MenuItemProps & { component: any, href: string }) => <MuiMenuItem {...props} />;

export default function AppNavMenu() {
    const pathName = usePathname();

    const handleClickMenuItem = (event) => {
        // event.preventDefault();
        // event.stopPropagation();
    }

    return (
        <>
            <Select<string>
                variant='outlined'
                size='small'
                value={pathName}
                renderValue={(value) => menuItems[value].title}
                IconComponent={() => <UnfoldMore />}
                slotProps={{
                    input: {
                        sx: {
                            pr: '0',
                        }
                    },
                }}
                inputProps={{
                    sx: {
                        pr: '0',
                    }
                }}
            >
                {Object.entries(menuItems).map(([path, { title, description, disabled }]) => (
                    <MenuItem component={Link} href={path} key={path} value={path} onClick={handleClickMenuItem} disabled={disabled}>
                        <ListItemIcon>{menuItems[path].icon}</ListItemIcon>
                        <ListItemText primary={title} secondary={description} />
                    </MenuItem>
                ))}
            </Select>
        </>
    )
}