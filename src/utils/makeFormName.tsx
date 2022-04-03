const FORM_NAME_PREFIX: string = 'zisk__'

export const makeFormName = (suffix: string): string => {
    return `${FORM_NAME_PREFIX}${suffix}`
}
