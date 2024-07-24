import { Box, Stack } from "@mui/material";
import HeaderBreadcrumbs from "./HeaderBreadcrumbs";
import BaseContainer from "../layout/BaseContainer";
import HeaderTabs from "./HeaderTabs";

/**
 * Header component used by the app
 */
export default function Header() {
    return (
        <Box sx={{ backgroundColor: 'rgba(255, 12, 12, 0.075)' }}>
            <BaseContainer>
                <Stack
                    direction='row'
                    gap={1}
                    alignItems='center'
                    sx={{
                        py: 3,
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    <HeaderBreadcrumbs />
                </Stack>
                <HeaderTabs />
            </BaseContainer>
        </Box>
    )    
}
