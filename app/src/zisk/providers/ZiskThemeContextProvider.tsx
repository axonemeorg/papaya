import { CssBaseline, ThemeProvider } from "@mui/material";
import { PropsWithChildren, useContext } from "react";
import appTheme from "@/components/theme/theme";
import { JournalContext } from "@/contexts/JournalContext";
import { ZiskUserThemeContext } from "@/contexts/UserThemeContext";
import { useQuery } from "@tanstack/react-query";
import { UserTheme } from "@/types/schema";
import { getUserThemes } from "@/database/queries";
import { ziskFactoryUserThemes } from "@/constants/themes";

export default function ZiskThemeContextProvider(props: PropsWithChildren) {
    const journalContext = useContext(JournalContext)
    const { journal } = journalContext

    const getUserThemesQuery = useQuery<Record<UserTheme['_id'], UserTheme>>({
		queryKey: ['userThemes'],
		queryFn: getUserThemes,
		initialData: {},
	})

    let activeTheme: UserTheme | null = null
    if (journal && journal.activeThemeId && getUserThemesQuery.data) {
        activeTheme = getUserThemesQuery.data[journal.activeThemeId] ?? null
    }
    activeTheme = ziskFactoryUserThemes[0] // TODO remove this

    const userThemeContext: ZiskUserThemeContext = {
        activeTheme,
        getUserThemesQuery,
    }

    return (
        <ThemeProvider theme={appTheme}>
            <CssBaseline />
            <ZiskUserThemeContext.Provider value={userThemeContext}>
                {props.children}
            </ZiskUserThemeContext.Provider>
        </ThemeProvider>
    )
}
