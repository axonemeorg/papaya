'use client';

import { Box, Button, colors, Grid, MenuItem, Paper, Popover, Popper, Select, Stack, Tooltip } from '@mui/material';
import * as muiColors from '@mui/material/colors';
import { useState } from 'react';

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

export const colorNameLabels = {
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

export const colorShadeLabels = {
    [200]: 'Light',
    [400]: '',
    [800]: 'Deep'
}

interface SwatchProps {
    color: string;
    name?: string;
    onClick?: () => void;
}

const sortedColors = colorGroups.reduce((colors: [string, number][], colorGroup: string[]) => {
    colorShades.forEach((shade) => {
        colorGroup.forEach((colorName) => {
            colors.push([colorName, shade])
        })
    });

    return colors;
}, []);

export const Swatch = (props: SwatchProps) => {
    const Children = (
        <Paper
            className='swatch'
            component={'i'}
            onClick={props.onClick}
            sx={{
                display: 'block',
                m: 0.25,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: props.color,
                transition: 'all 0.2s',
            }}
            elevation={props.onClick ? 3 : 0}
        />
    );

    if (props.name) {
        return (
            <Tooltip
                title={props.name}
                disableInteractive
                placement='top'
                slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: 'offset',
                          options: {
                            offset: [0, -14],
                          },
                        },
                      ],
                    },
                }}
            >
                {Children}
            </Tooltip>
        )
    }

    return Children;
}

export interface ColorPickerProps {
    color?: string;
    onChange?: (color: string) => void;
}

export const getMuiColor = (color: string) => {
    const [colorName, colorShade] = color.split('.');
    return muiColors[colorName][colorShade];
}

const DEFAULT_COLOR = 'red.400'

export default function ColorPicker(props: ColorPickerProps) {
    const color = props.color || DEFAULT_COLOR;

    return (
        <>
            <Select
                size='small'
                value={color}
                onChange={(event) => {
                    props.onChange?.(event.target.value)
                }}
                renderValue={(value: string) => {
                    const color = getMuiColor(value);
                    return (
                        <Swatch color={color} />
                    )
                }}
                MenuProps={{

                    slotProps: {
                        paper: {
                            sx: { px: 1, py: 0.5 }
                        },
                    },
                    MenuListProps: {
                        sx: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(7, 1fr)'
                        },
                    }
                }}
            >
                {sortedColors.map(([colorName, shade]) => {
                    const color = [colorName, shade].join('.');
                    const colorNameParts = [colorShadeLabels[shade], colorNameLabels[colorName]]
                        .filter(Boolean);
                    if (colorNameParts[1]) {
                        colorNameParts[1] = String(colorNameParts[1]).toLowerCase()
                    }

                    return (
                        <MenuItem
                            value={color}
                            key={color}
                            disableTouchRipple
                            sx={{
                                p: 0,
                                '&:hover, &:focus, &.Mui-selected': {
                                    background: 'none !important', // Disable background color change
                                    color: 'inherit', // Disable color change
                                },
                                '&:not(:hover) .swatch': {
                                    boxShadow: 'none !important',
                                },
                                '&:hover .swatch, &.Mui-focusVisible .swatch': {
                                    width: '22px',
                                    height: '22px',
                                    margin: 0
                                },
                            }}
                        >
                            <Tooltip title='hello'>
                                <Swatch
                                    color={muiColors[colorName][shade]}
                                    name={colorNameParts.join(' ')}
                                />
                            </Tooltip>
                        </MenuItem>
                    )
                })}
            </Select>
        </>
    )
}
