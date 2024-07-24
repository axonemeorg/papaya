'use client'

import { createTheme } from "@mui/material";

/**
 * The MUI app theme, which is consumed by the MUI ThemeProvider component.
 */
const appTheme = createTheme({
    palette: {
        mode: 'dark',
        primary:{
            main: 'rgb(255, 12, 12)'
        }
    },
    typography: {
        fontFamily: ['Montserrat', 'Arial', 'sans-serif'].join(', '),
    }
});

export default appTheme;
