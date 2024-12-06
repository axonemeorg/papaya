'use client';

import { Box, Button, Container, Stack } from "@mui/material";
import { useEffect } from "react";
import SplashComponent from "../components/SplashComponent";

import { Gradient } from "../gradient";

export default function HomePage() {
    useEffect(() => {
        const gradient = new Gradient() as any;
        gradient.initGradient("#gradient-canvas");
    }, []);

    const appLink = process.env.NEXT_PUBLIC_APP_PROD_URL;

    return (
        <>
            <canvas id="gradient-canvas" style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} />
            <Container maxWidth='xl' disableGutters sx={{ px: 8, boxSizing: 'border-box' }}>
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
        </>
    )
}
