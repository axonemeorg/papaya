
import { Box, Button, Fade, Icon, InputAdornment, Popover, Stack, Tab, Tabs, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { FixedSizeGrid } from 'react-window';

import icons from '@/constants/icons';
import { ReactNode, useMemo, useState } from 'react';
import ColorPicker, { ColorPickerProps } from '../color/ColorPicker';
import { Add, FormatColorReset, Search, Shuffle } from '@mui/icons-material';
import { useScrollbarWidth } from '@/hooks/useScrollbarWidth';
import Fuse from 'fuse.js';
import IconPicker from '../icon/IconPicker';

interface AvatarPickerProps {
    icon?: string;
    onChangeIcon?: (icon: string) => void;
    ColorPickerProps?: ColorPickerProps;
    renderButton?: (icon: string) => ReactNode;
}

const sortedIcons = icons.sort((a, b) => b.popularity - a.popularity);

const fuseOptions = {
    keys: ['name', 'tags'], // Fields to search in
    includeScore: true, // Include the score of how good each match is
    threshold: 0.2, // Tolerance for fuzzy matching
    minMatchCharLength: 2 // Minimum number of characters that must match
};

// Create a new Fuse instance
const fuse = new Fuse(sortedIcons, fuseOptions);

const COLUMN_COUNT = 10;
const CELL_SIZE = 40;

export default function AvatarPicker(props: AvatarPickerProps) {
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [currentTab, setCurrentTab] = useState<number>(0);

    const scrollbarWidth = useScrollbarWidth();

    const open = Boolean(anchorEl);

    return (
        <>
            <Button onClick={(event) => setAnchorEl(event.currentTarget)} size='small' sx={{ minWidth: 'unset' }}>
                {/* <Icon sx={(theme) => ({ color: iconColor ?? theme.palette.text.primary })}>{icon}</Icon> */}
                <Icon>alarm</Icon>
            </Button>
            <Popover
                TransitionComponent={Fade}
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
            >
                <Box px={2} pt={1}>
                    <Tabs value={currentTab} onChange={(_event, newValue) => setCurrentTab(newValue)}>
                        <Tab label='Icon'/>
                        <Tab label='Emoji' />
                        <Tab label='Letters' />
                        <Tab label='Image' />
                    </Tabs>
                </Box>
                {currentTab === 0 && (
                    <IconPicker />
                )}
            </Popover>
        </>
    )
}
