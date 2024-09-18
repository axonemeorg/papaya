'use client';

import { Insights, ReceiptLong, UnfoldMore } from "@mui/icons-material";
import { Button, ListItemIcon, ListItemText, MenuItem as MuiMenuItem, MenuItemProps, Select } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo, useState } from "react";

type NavMenuItem = {
    slug: string;
    icon: ReactNode;
    title: string;
    description: string;
    disabled?: boolean;
    pathPattern: RegExp;
};

const menuItems: NavMenuItem[] = [
    {
        slug: '/journal',
        icon: <ReceiptLong />,
        title: 'Journal',
        description: 'Organize your expenses',
        pathPattern: /\/journal(\/\d+){0,2}\/?$/,
    },
    {
        slug: '/analyze',
        icon: <Insights />,
        title: 'Analyze',
        description: 'Understand your spending',
        disabled: true,
        pathPattern: /\/analyze$/,
    },
];

const DEFAULT_MENU_ITEM: NavMenuItem = { ...menuItems[0] }

const MenuItem = (props: MenuItemProps & { component: any, href: string }) => <MuiMenuItem {...props} />;

export default function AppNavMenu() {
    const pathName = usePathname();

    const activeMenu: NavMenuItem | undefined = useMemo(() => {
        return menuItems.find((menuItem) => {
            return menuItem.pathPattern.test(pathName);
        }) ?? DEFAULT_MENU_ITEM;
    }, [pathName]);

    return (
        <>
            <Select<string>
                variant='outlined'
                size='small'
                value={activeMenu.slug}
                renderValue={() => activeMenu.title}
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
                {menuItems.map((item) => (
                    <MenuItem component={Link} href={item.slug} key={item.slug} value={item.slug} disabled={item.disabled}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.title} secondary={item.description} />
                    </MenuItem>
                ))}
            </Select>
        </>
    )
}