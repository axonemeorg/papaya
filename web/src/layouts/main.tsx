import Header from "@/components/nav/header/Header";
import AppMenu from "@/components/nav/menu/AppMenu";
import { Paper, Stack } from "@mui/material";
import { PropsWithChildren } from "react";

export const MainLayout = (props: PropsWithChildren) => {
    const { children } = props;

	return (
		<Stack component='main' sx={{ minHeight: '100dvh' }}>
			<Header />
            <Stack direction='row' sx={{ flex: 1, gap: 2 }}>
                <AppMenu view={'desktop'} />
			    <Paper sx={{ flex: 1 }}>
                    {children}
                </Paper>
            </Stack>
        </Stack>
	)
}
