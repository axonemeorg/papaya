import { Box, colors, Grid, Paper, Popover, Popper, Stack, Tooltip } from '@mui/material';
import * as muiColors from '@mui/material/colors';

const colorGroups = [
    [
        'red',
        'pink',
        'purple',
        // 'deepPurple',
        'indigo',
        'blue',
        // 'lightBlue',
        'cyan',
        'teal',
    ],
    [
        'green',
        'lightGreen',
        'lime',
        // 'yellow',
        'amber',
        // 'orange',
        'deepOrange',
        'brown',
        // 'grey',
        'blueGrey',
    ]
];

const colorNameLabels = {
    'red': 'Red',
    'pink': 'Pink',
    'purple': 'Purple',
    'indigo': 'Indigo',
    'blue': 'Blue',
    'cyan': 'Cyan',
    'teal': 'Teal',
    'green': 'Green',
    'lightGreen': 'Sage',
    'lime': 'Lime',
    'amber': 'Amber',
    'deepOrange': 'Orange',
    'brown': 'Brown',
    'blueGrey': 'Grey',
}

const colorShades = [
    200,
    400,
    800
]

const colorShadeLabels = {
    [200]: 'Light',
    [400]: '',
    [800]: 'Deep'
}

interface SwatchProps {
    color: string;
    name?: string;
    onClick?: () => void;
}

export const Swatch = (props: SwatchProps) => {
    const onClickStyles = props.onClick ? {
        '&:not(:hover)': {
            boxShadow: 'none !important',
        },
        '&:hover': {
            width: '22px',
            height: '22px',
            margin: 0
        },
        cursor: 'pointer'
    } : {};

    const Children = (
        <Paper
            component={props.onClick ? 'a' : 'i'}
            onClick={props.onClick}
            sx={{
                m: 0.25,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: props.color,
                ...onClickStyles
            }}
            elevation={props.onClick ? 3 : 0}
        />
    );

    if (props.name) {
        return (
            <Tooltip
                title={props.name}
                // placement='top'
                // slotProps={{
                //     popper: {
                //       modifiers: [
                //         {
                //           name: 'offset',
                //           options: {
                //             offset: [0, -14],
                //           },
                //         },
                //       ],
                //     },
                // }}
            >
                {Children}
            </Tooltip>
        )
    }

    return Children;
}

interface ColorPickerProps {
    open: boolean;
    anchorEl: any;
    onClose: () => void;
    onChange: (color: string) => void;
}

export default function ColorPicker(props: ColorPickerProps) {
    return (
        <Popover id='color-picker' open={props.open} anchorEl={props.anchorEl} onClose={props.onClose} >
            <Stack p={2}>
                {colorGroups.map((colorGroup) => {
                    return (
                        
                        <Box display='grid' gridTemplateColumns={'repeat(7, 1fr)'}>
                            {colorShades.map((shade) => {
                                return (
                                    <>
                                        {colorGroup.map((colorName) => {
                                            const color = [colorName, shade].join('.');
                                            const colorNameParts = [colorShadeLabels[shade], colorNameLabels[colorName]]
                                                .filter(Boolean);
                                            if (colorNameParts[1]) {
                                                colorNameParts[1] = String(colorNameParts[1]).toLowerCase()
                                            }
                                            
                                            return (
                                                <Swatch
                                                    color={muiColors[colorName][shade]}
                                                    name={colorNameParts.join(' ')}
                                                    onClick={() => props.onChange(color)}
                                                />
                                            )
                                        })}
                                    </>

                                )
                            })}
                        </Box>
                    );
                })}
                
            </Stack>
        </Popover>
    )
}
