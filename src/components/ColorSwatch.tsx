import React from 'react'
import classNames from 'classnames'

import { Color } from '@/types/app'

interface IColorSwatchProps extends React.HTMLProps<HTMLDivElement> {
    colorString: Color
    square?: boolean
}

const ColorSwatch = (props: IColorSwatchProps) => {
    const { colorString, className, square, ...rest } = props

    return (
        <div
            className={classNames('color-swatch', className, `--${colorString}`, { '--square': square })}
            {...rest}
        />
    )
}

export default ColorSwatch
