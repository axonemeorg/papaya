
import { Box, Button, Icon, InputAdornment, Popover, Stack, TextField } from '@mui/material';
import { FixedSizeGrid } from 'react-window';

import icons from '@/constants/icons';
import { useState } from 'react';
import ColorPicker, { getMuiColor } from '../color/ColorPicker';
import { Search, Shuffle } from '@mui/icons-material';
import { useScrollbarWidth } from '@/hooks/useScrollbarWidth';

interface IconPickerProps {
    color: string;
    icon: string;
    onChangeColor: (color: string) => void;
    onChangeIcon: (icon: string) => void;
}

export default function IconPicker(props: IconPickerProps) {
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const open = Boolean(anchorEl)

    const scrollbarWidth = useScrollbarWidth();

    const iconColor = getMuiColor(props.color);

    const columnCount = 10;
    const rowCount = Math.ceil(icons.length / columnCount);
    const cellSize = 40;

    const handleShuffle = () => {
        const iconIndex = Math.floor(Math.random() * icons.length);
        props.onChangeIcon(icons[iconIndex].name);
    }

    return (
        <>
            <Button onClick={(event) => setAnchorEl(event.currentTarget)} size='small' sx={{ minWidth: 'unset' }}>
                <Icon sx={{ color: iconColor }}>{props.icon}</Icon>
            </Button>
            <Popover
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
                    />
                    <Button
                        onClick={() => handleShuffle()}
                        variant='outlined'
                        size='small'
                    >
                        <Shuffle />
                    </Button>
                    <ColorPicker color={props.color} onChange={props.onChangeColor} />
                </Stack>
                <Box pl={2}>
                    <FixedSizeGrid
                        columnCount={columnCount}
                        columnWidth={cellSize}
                        height={cellSize * 8}
                        rowCount={rowCount}
                        rowHeight={cellSize}
                        width={(cellSize * columnCount) + scrollbarWidth}
                        style={{ overflowX: 'hidden' }}
                    >
                        {({ columnIndex, rowIndex, style }) => {
                            const index = rowIndex * columnCount + columnIndex;
                            const icon = icons[index];

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
