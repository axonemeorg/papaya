const FORM_NAME_PREFIX: string = 'zisk__'

export const makeFormName = (suffix: string): string => {
    return `${FORM_NAME_PREFIX}${suffix}`
}

export const makeDollars = (d: number): string => {
    return d % 1 === 0
        ? `$${d}`
        : `$${Math.round(d * 100) / 100}`
}
