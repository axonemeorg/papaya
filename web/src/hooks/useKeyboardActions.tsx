import { useEffect } from "react"

export enum KeyboardActionName {
    CREATE_JOURNAL_ENTRY = 'CREATE_JOURNAL_ENTRY',  
    OPEN_SEARCH_MODAL = 'OPEN_SEARCH_MODAL',
}

export const KEYBOARD_ACTIONS: Record<KeyboardActionName, string[]> = {
    CREATE_JOURNAL_ENTRY: ['c'],
    OPEN_SEARCH_MODAL: ['/'],
}


export default function useKeyboardActions(name: KeyboardActionName, action: () => void): void {
    useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const activeElement = document.activeElement as HTMLElement;
	
			// Check if the focused element is an input, textarea, or contenteditable
			const isEditable =
				activeElement.tagName === 'INPUT' ||
				activeElement.tagName === 'TEXTAREA' ||
				activeElement.isContentEditable;

			if (isEditable) {
                return
            }
            
            const keystrokes = KEYBOARD_ACTIONS[name]

            // TODO check if keystroke is activated
            const activated = false

            if (activated) {
				action()
			}
		};
	
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [name, action]);
}
