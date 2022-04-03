import React from 'react'
import classNames from 'classnames'

import { Color } from './ColorSwatch'

interface IColorTextProps extends React.HTMLProps<HTMLSpanElement> {
    colorString: Color
}

const ColorText = (props: IColorTextProps) => {
    const { children, className, colorString, ...rest } = props

    return (
        <span className={classNames('color-text', className, `--${colorString}`)} {...rest}>
            {children}
        </span>
    )
}

export default ColorText
