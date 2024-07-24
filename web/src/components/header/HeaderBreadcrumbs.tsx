'use client'

import { Breadcrumbs, Link, Stack } from "@mui/material"
import AppLogo from "./AppLogo"
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export interface IBreadcrumb {
    label: string;
    href: string;
}

const breadcrumbMatchers =  [

]

/**
 * Renders breadcrumbs used by the app header.
 */
export default function HeaderBreadcrumbs() {
    const pathname = usePathname();

    // Determines which breadcrumbs to render based on the current URL path.
    const breadcrumbs = useMemo(() => {
        const crumbs: IBreadcrumb[] = []
        pathname.split('/').reduce((previousPath: string, pathItem: string) => {
            const path = [previousPath, pathItem].join('/')
    
            if (path) {
                const match = breadcrumbMatchers.find((matcher) => matcher.pattern.test(path));
    
                const label = match
                    ?  match.label
                    : pathItem;
                
                crumbs.push({
                    label,   
                    href: pathItem,
                })
            }
            
            return path
        });

        return crumbs;
    }, [pathname])

    return (
        <Breadcrumbs aria-label="breadcrumb">
            <AppLogo />
            {breadcrumbs.map((breadcrumb) => {
                return (
                    <Link key={breadcrumb.label} component={NextLink} underline="hover" color="inherit" href={breadcrumb.href}>
                        {breadcrumb.label}
                    </Link>
                )
            })}
        </Breadcrumbs>
    )
}
