import { CssBaseline, ThemeProvider } from "@mui/material";
import { PropsWithChildren } from "react";
import appTheme from "@/components/theme/theme";

export default function ZiskThemeProvider(props: PropsWithChildren) {
    return (
        <ThemeProvider theme={appTheme}>
            <CssBaseline />
            {props.children}
        </ThemeProvider>
    )
}
