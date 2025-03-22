import { UserTheme } from "@/types/schema"
import { DefinedUseQueryResult } from "@tanstack/react-query";
import { createContext } from "react"

export interface ZiskUserThemeContext {
    getUserThemesQuery: DefinedUseQueryResult<Record<UserTheme['_id'], UserTheme>, Error>;
    activeTheme: UserTheme | null;
}

export const ZiskUserThemeContext = createContext<ZiskUserThemeContext>({} as ZiskUserThemeContext)
