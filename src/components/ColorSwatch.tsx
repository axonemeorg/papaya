import React from 'react'
import classNames from 'classnames'

import { Color } from '@/types/app'

interface IColorSwatchProps extends React.HTMLProps<HTMLDivElement> {
    colorString: Color
}

const ColorSwatch = (props: IColorSwatchProps) => {
    const { colorString, className, ...rest } = props

    return (
        <div className={classNames('color-swatch', className, `--${colorString}`)} />
    )
}

export default ColorSwatch
