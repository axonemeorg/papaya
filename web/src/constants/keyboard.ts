export enum KeyboardActionName {
    CREATE_JOURNAL_ENTRY = 'CREATE_JOURNAL_ENTRY',  
    OPEN_SEARCH_MODAL = 'OPEN_SEARCH_MODAL',
}

export interface Keystroke {
    ctrl?: boolean
    alt?: boolean
    shift?: boolean
    symbol: string
}

export const KEYBOARD_ACTIONS: Record<KeyboardActionName, Keystroke> = {
    CREATE_JOURNAL_ENTRY: { symbol: 'c' },
    OPEN_SEARCH_MODAL: { symbol: '/' },
}
