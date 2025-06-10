'use client'

import { createTheme } from "@mui/material";
import { unbounded } from "./fonts/unbounded";

const appTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: unbounded.style.fontFamily
    },
});

export default appTheme;
