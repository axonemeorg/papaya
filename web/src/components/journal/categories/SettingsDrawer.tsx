'use client';

import { Box, Drawer } from "@mui/material";
import ManageCategories from "./ManageCategories";

interface SettingsDrawerProps {
    open: boolean;
    onClose: () => void;
}

export default function SettingsDrawer(props: SettingsDrawerProps) {
    return (
        <Drawer
            open={props.open}
            onClose={() => props.onClose()}
            anchor="right"
        >
            <Box p={4} sx={{ width: '500px' }}>
                <ManageCategories
                    onClose={() => props.onClose()}
                />
            </Box>
        </Drawer>
    )
}
