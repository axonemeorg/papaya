import { Paper, Stack } from "@mui/material";
import { PropsWithChildren } from "react";
import BaseContainer from "./BaseContainer";

/**
 * A base layout component, which provides boilerplate for actual page content
 * to begin.
 */
export default function BaseLayout(props: PropsWithChildren) {
    return (
        <Stack component={Paper} square variant="outlined" sx={{ flex: 1, pt: 3, borderLeft: 0, borderRight: 0 }}>
            <BaseContainer sx={{ flex: 1, display: 'flex', flexFlow: 'column nowrap' }}>
                {props.children}
            </BaseContainer>
        </Stack>
    )
}
