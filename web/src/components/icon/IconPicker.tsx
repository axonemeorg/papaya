
import { Box, Button, Fade, Icon, InputAdornment, Popover, Stack, TextField } from '@mui/material';
import { FixedSizeGrid } from 'react-window';

import icons from '@/constants/icons';
import { useMemo, useState } from 'react';
import ColorPicker, { getMuiColor } from '../color/ColorPicker';
import { Search, Shuffle } from '@mui/icons-material';
import { useScrollbarWidth } from '@/hooks/useScrollbarWidth';
import Fuse from 'fuse.js';

const DEFAULT_ICON = 'home'
const DEFAULT_COLOR = 'red.400'

interface IconPickerProps {
    color?: string;
    icon?: string;
    onChangeColor?: (color: string) => void;
    onChangeIcon?: (icon: string) => void;
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
    const icon = props.icon || DEFAULT_ICON;
    const color = props.color || DEFAULT_COLOR;

    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const open = Boolean(anchorEl)

    const scrollbarWidth = useScrollbarWidth();

    const iconColor = getMuiColor(color);
    

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
                <Icon sx={{ color: iconColor }}>{icon}</Icon>
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
                <Stack direction='row' p={2} mb={2} gap={1} alignItems='center'>
                    <TextField
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <Search />
                                </InputAdornment>
                            )
                        }}
                        placeholder='Filter'
                        variant='outlined'
                        size='small'
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
                    <ColorPicker color={color} onChange={(newColor) => props.onChangeColor?.(newColor)} />
                </Stack>
                <Box pl={2}>
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
                                        sx={{ 
                                            minWidth: 'unset',
                                            '& span': { color: `${iconColor} !important` }
                                            
                                        }}
                                        style={{
                                            ...style,
                                        }}
                                    >
                                        <Icon style={{ fontSize: '36px' }}>{icon.name}</Icon>
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
