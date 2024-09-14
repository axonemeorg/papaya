
import { Box, Button, Fade, Icon, InputAdornment, Popover, Stack, Tab, Tabs, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { FixedSizeGrid } from 'react-window';

import icons from '@/constants/icons';
import { ReactNode, useMemo, useState } from 'react';
import ColorPicker, { ColorPickerProps } from '../pickers/ColorPicker';
import { Add, FormatColorReset, Search, Shuffle } from '@mui/icons-material';
import { useScrollbarWidth } from '@/hooks/useScrollbarWidth';
import Fuse from 'fuse.js';
import { IconWithGradient } from '../icon/IconWithGradient';
import { ItemAvatar } from '@/types/get';
import { AvatarVariant } from '@/types/enum';

// const DEFAULT_ICON = 'home'

interface IconPickerProps {
    value: ItemAvatar;
    onChange: (avatar: ItemAvatar) => void;
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
    const color: string | undefined = props.value.avatarPrimaryColor ?? undefined

    const [searchQuery, setSearchQuery] = useState<string>('');

    const scrollbarWidth = useScrollbarWidth();

    // const iconPrimaryColor = '#FF0000';
    // const iconSecondaryColor = '#00FF00';
    // const iconColor: string | undefined = undefined;

    const handleShuffle = () => {
        const iconIndex = Math.floor(Math.random() * sortedIcons.length);
        const newIcon = sortedIcons[iconIndex].name;
        props.onChange({
            ...props.value,
            avatarContent: newIcon,
            avatarVariant: AvatarVariant.Enum.PICTORIAL
        });
    }

    const handleChangeColor = (color: string) => {
        props.onChange({
            ...props.value,
            avatarVariant: AvatarVariant.Enum.PICTORIAL,
            avatarPrimaryColor: color,
        });
    }

    const handleChangeIcon = (icon: string) => {
        props.onChange({
            ...props.value,
            avatarVariant: AvatarVariant.Enum.PICTORIAL,
            avatarContent: icon,
        });
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

    console.log('iconPicker.props:', props)

    return (
        <>
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
                <ColorPicker
                    color={color}
                    onChange={handleChangeColor}
                />
                <Button
                    onClick={() => handleShuffle()}
                    variant='outlined'
                    size='small'
                >
                    <Shuffle />
                </Button>
            </Stack>
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
                                    onClick={() => handleChangeIcon(icon.name)}
                                    size="small"
                                    sx={(theme) => ({ 
                                        minWidth: 'unset',
                                        '& span': { color: `${color ?? theme.palette.text.primary} !important` }
                                    })}
                                    style={{
                                        ...style,
                                    }}
                                >
                                    <Icon style={{ fontSize: '36px' }} sx={{ color }}>
                                        {icon.name}
                                    </Icon>
                                </Button>
                            )
                        );
                    }}
                </FixedSizeGrid>
            </Box>
        </>
    )
}
