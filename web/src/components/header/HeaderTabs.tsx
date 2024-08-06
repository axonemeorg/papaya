'use client'

import { Tab, Tabs } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface IHeaderTab {
    label: string;
    href: string;
    matcher: RegExp;
}

const appTabs = [

]

/**
 * Renders application tabs used by the app header.
 */
export default function HeaderTabs() {
    const pathname = usePathname();
    const value = appTabs.findIndex((tab) => tab.matcher.test(pathname));

    return (
        <Tabs value={value} sx={{ mt: -2 }}>
            {appTabs.map((tab) => {
                return (
                    <Tab
                        key={tab.label}
                        label={tab.label}
                        component={Link}
                        href={tab.href}
                    />
                )
            })}
        </Tabs>
    )
}
