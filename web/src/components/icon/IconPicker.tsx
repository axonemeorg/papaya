
import { Box, Button, Grid, Icon, Popover, Stack, TextField } from '@mui/material';

import icons from '@/constants/icons';
import { useState } from 'react';
import ColorPicker, { getMuiColor } from '../color/ColorPicker';

interface IconPickerProps {
    color: string;
    icon: string;
    onChangeColor: (color: string) => void;
    onChangeIcon: (icon: string) => void;
}

export default function IconPicker(props: IconPickerProps) {
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const open = Boolean(anchorEl)

    const iconColor = getMuiColor(props.color);

    console.log('iconColor:', iconColor)

    return (
        <>
            <Button onClick={(event) => setAnchorEl(event.currentTarget)} size='small' sx={{ minWidth: 'unset' }}>
                <Icon sx={{ color: iconColor }}>{props.icon}</Icon>
            </Button>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
            >
                <Stack direction='row'>
                    <TextField />
                    <ColorPicker color={props.color} onChange={props.onChangeColor} />
                </Stack>
                <Box
                    sx={{
                        display:  'grid',
                        gridTemplateColumns: 'repeat(10, 1fr)',
                        '& span': {
                            color: `${iconColor} !important`,
                        }
                    }}
                >
                    {(icons as unknown as any[]).map((icon) => {
                        return (
                            <Button size='small' sx={{ minWidth: 'unset' }}>
                                <Icon>{icon.name}</Icon>
                            </Button>
                        )
                    })}

                </Box>
            </Popover>
        </>
    )
}
