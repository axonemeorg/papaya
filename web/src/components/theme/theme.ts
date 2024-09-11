'use client'

import { montserrat } from "@/fonts/montserrat";
import { createTheme } from "@mui/material";

/**
 * The MUI app theme, which is consumed by the MUI ThemeProvider component.
 */
const appTheme = createTheme({
    palette: {
        mode: 'dark',
        // primary:{
        //     main: 'rgb(251, 202, 4)'
        // }
    },
    typography: {
        fontFamily: montserrat.style.fontFamily
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    // borderRadius: 28,
                    textTransform: 'unset'
                }
            }
        }
    }
});

export default appTheme;
