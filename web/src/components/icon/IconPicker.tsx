
import { Box, Button, Fade, Icon, InputAdornment, Popover, Stack, Tab, Tabs, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { FixedSizeGrid } from 'react-window';

import icons from '@/constants/icons';
import { ReactNode, useMemo, useState } from 'react';
import ColorPicker, { ColorPickerProps, getMuiColor } from '../color/ColorPicker';
import { Add, FormatColorReset, Search, Shuffle } from '@mui/icons-material';
import { useScrollbarWidth } from '@/hooks/useScrollbarWidth';
import Fuse from 'fuse.js';
import { IconWithGradient } from './IconWithGradient';

const DEFAULT_ICON = 'home'

interface IconPickerProps {
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

export default function IconPicker(props: IconPickerProps) {
    const icon: string = props.icon || DEFAULT_ICON;
    const color: string | undefined = props.ColorPickerProps?.color ?? undefined

    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const open = Boolean(anchorEl)

    const scrollbarWidth = useScrollbarWidth();

    const iconPrimaryColor = '#FF0000';
    const iconSecondaryColor = '#00FF00';
    const iconColor: string | undefined = color ? getMuiColor(color) : undefined;

    const handleShuffle = () => {
        const iconIndex = Math.floor(Math.random() * sortedIcons.length);
        props.onChangeIcon?.(sortedIcons[iconIndex].name);
    }

    // Search for an icon
    const results = useMemo(() => {
        if (!searchQuery) {
            return sortedIcons;
        }

        return fuse.search(searchQuery).map((result) => result.item)
    }, [searchQuery]);

    const rowCount = useMemo(() => {
        return Math.ceil(results.length / COLUMN_COUNT);
    }, [results]);

    return (
        <>
            <Button onClick={(event) => setAnchorEl(event.currentTarget)} size='small' sx={{ minWidth: 'unset' }}>
                <Icon sx={(theme) => ({ color: iconColor ?? theme.palette.text.primary })}>{icon}</Icon>
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
                    <Tabs value={0}>
                        <Tab label='Icon'/>
                        <Tab label='Emoji' />
                        <Tab label='Letters' />
                        <Tab label='Image' />
                    </Tabs>
                </Box>
                <Stack direction='row' p={2} gap={1} alignItems='center'>
                    <TextField
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <Search />
                                </InputAdornment>
                            )
                        }}
                        placeholder='Find icon...'
                        variant='outlined'
                        size='small'
                        fullWidth
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                    />
                    <Button
                        onClick={() => handleShuffle()}
                        variant='outlined'
                        size='small'
                    >
                        <Shuffle />
                    </Button>
                </Stack>
                {props.ColorPickerProps && (
                    <Stack direction='row' p={2} gap={1} mt={2}>
                        <ColorPicker
                            id='primary-color-picker'
                            label='Primary'
                            color={color}
                            onChange={(newColor) => props.ColorPickerProps?.onChange?.(newColor)}
                        />
                        <ColorPicker
                            id='secondary-color-picker'
                            label='Secondary'
                            color={color}
                            onChange={(newColor) => props.ColorPickerProps?.onChange?.(newColor)}
                        />
                        <Button
                            // onClick={() => props.ColorPickerProps?.onChange?.(undefined)}
                            variant='outlined'
                            size='small'
                        >
                            <Add />
                        </Button>
                        <Button
                            // onClick={() => props.ColorPickerProps?.onChange?.(undefined)}
                            variant='outlined'
                            size='small'
                        >
                            <FormatColorReset />
                        </Button>
                    </Stack>
                )}
                <Box pl={2} mt={2}>
                    <FixedSizeGrid
                        columnCount={COLUMN_COUNT}
                        columnWidth={CELL_SIZE}
                        height={CELL_SIZE * 8}
                        rowCount={rowCount}
                        rowHeight={CELL_SIZE}
                        width={(CELL_SIZE * COLUMN_COUNT) + scrollbarWidth}
                        style={{ overflowX: 'hidden' }}
                    >
                        {({ columnIndex, rowIndex, style }) => {
                            const index = rowIndex * COLUMN_COUNT + columnIndex;
                            const icon = results[index];

                            return (
                                icon && (
                                    <Button
                                        key={index}
                                        onClick={() => props.onChangeIcon(icon.name)}
                                        size="small"
                                        sx={(theme) => ({ 
                                            minWidth: 'unset',
                                            '& span': { color: `${iconColor ?? theme.palette.text.primary} !important` }
                                            
                                        })}
                                        style={{
                                            ...style,
                                        }}
                                    >
                                        <IconWithGradient style={{ fontSize: '36px' }} primaryColor={iconPrimaryColor} secondaryColor={iconSecondaryColor}>
                                            {icon.name}
                                        </IconWithGradient>
                                    </Button>
                                )
                            );
                        }}
                    </FixedSizeGrid>
                </Box>
            </Popover>
        </>
    )
}
