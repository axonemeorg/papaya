import React from 'react'
import classNames from 'classnames'

interface IColorSwatchProps extends React.HTMLProps<HTMLDivElement> {
    colorString: string
}

export type Color =
    | 'coral'
    | 'penelope'
    | 'sunday'
    | 'grimace'
    | 'blue'
    | 'ocean'
    | 'pre-teens'
    | 'eucalyptus'
    | 'moss'
    | 'sunshine'
    | 'yellow-red'
    | 'ginger-beard'
    | 'chocolate-banana'
    | 'matte'
    | 'twenty-twenty'

export const colorNamess: Record<Color, string> = {
    'coral': 'Coral',
    'penelope': 'Penelope',
    'sunday': 'Sunday',
    'grimace': 'Grimace',
    'blue': 'Blue',
    'ocean': 'Ocean',
    'pre-teens': 'Pre-teens',
    'eucalyptus': 'Eucalyptus',
    'moss': 'Moss',
    'sunshine': 'Sunshine',
    'yellow-red': 'Yellow-Red',
    'ginger-beard': 'Ginger Beard',
    'chocolate-banana': 'Chocolate Banana',
    'matte': 'Matte',
    'twenty-twenty': 'Twenty-Twenty'
}

const ColorSwatch = (props: IColorSwatchProps) => {
    const { colorString, className, ...rest } = props

    return (
        <div className={classNames('color-swatch', className, `--${colorString}`)} />
    )
}

export default ColorSwatch
