import { Box, Button, Container, Stack } from "@mui/material";
import { PropsWithChildren } from "react";
import SplashComponent from "../components/SplashComponent";

export default function HomePage() {
    const appLink = process.env.NEXT_PUBLIC_APP_PROD_URL;

    return (
        <Container maxWidth='xl' disableGutters sx={{ px: 8, py: 4, boxSizing: 'border-box' }}>
            <Stack sx={{ minHeight: '100dvh' }} gap={4}>
                <Stack direction='row' alignItems={'center'} justifyContent='space-between' sx={{ py: 2 }}>
                    <img src='/images/logo/logo-w.svg' style={{ height: '36px' }} />
                    <Button component='a' href={appLink} variant='contained'>
                        Go to App
                    </Button>
                </Stack>
                <Stack sx={{ flex: 1 }} justifyContent={'center'}>
                    <Box mt={-20}>
                        <SplashComponent />
                    </Box>
                </Stack>
            </Stack>
        </Container>
    )
}
