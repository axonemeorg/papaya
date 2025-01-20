import { KEYBOARD_ACTIONS, KeyboardActionName } from "@/constants/keyboard";
import { useEffect } from "react"

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
            
            const _keystrokes = KEYBOARD_ACTIONS[name]

            // TODO check if keystroke is activated
            const activated = false

            if (activated) {
				action()
                event.stopPropagation();
				event.preventDefault();
			}
		};
	
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [name, action]);
}
