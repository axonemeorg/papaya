import { Stack } from "@mui/material";
import { PropsWithChildren } from "react";
import SplashComponent from "../components/SplashComponent";

export default function HomePage() {
    return (
        <Stack sx={{ minHeight: '100dvh', width: '100dvw' }}>
            <SplashComponent />
        </Stack>
    )
}
