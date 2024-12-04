import Header from "@/components/nav/header/Header";
import AppMenu from "@/components/nav/menu/AppMenu";
import { Paper, Stack, useMediaQuery, useTheme } from "@mui/material";
import { NextPage } from "next";
import { PropsWithChildren } from "react";

const MainLayout = (props: PropsWithChildren) => {
    const { children } = props;

    const theme = useTheme();
    const usingMobileMenu = useMediaQuery(theme.breakpoints.down('sm'));

    const view = usingMobileMenu ? 'mobile' : 'desktop';

	return (
		<Stack component='main' sx={{ minHeight: '100dvh' }}>
			<Header view={view} />
            <Stack direction='row' sx={{ flex: 1, gap: 0 }}>
                <AppMenu view={view} />
			    <Paper sx={(theme) => ({
                    flex: 1,
                    borderTopLeftRadius: theme.spacing(2)
                })}>
                    {children}
                </Paper>
            </Stack>
        </Stack>
	)
}

export const getLayout = (page: any) => {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}
