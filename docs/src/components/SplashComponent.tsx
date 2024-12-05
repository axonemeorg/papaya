import { Box, Typography } from "@mui/material";


export default function SplashComponent() {
    const link = process.env.NEXT_PUBLIC_APP_PROD_URL;
    return (
        <Box>
            <Typography variant='h2' component='h1'>
                Zisk is the open-source, local-first personal finance app.
            </Typography>
        </Box>
    );
}
