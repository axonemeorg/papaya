import { KEYBOARD_ACTIONS, KeyboardActionName } from "@/constants/keyboard";
import { useEffect } from "react"
import useBrowserPlatform from "./useBrowserPlatform";

export default function useKeyboardActions(name: KeyboardActionName, action: () => void): void {
	const { macOs } = useBrowserPlatform()
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
            
            const keystroke = KEYBOARD_ACTIONS[name]
			if (keystroke.ctrlCnd) {
				if (macOs && !event.metaKey) {
					return
				} else if (!event.ctrlKey) {
					return
				}
			} else if (keystroke.altOpt && !event.altKey) {
				return
			} else if (keystroke.shift && !event.shiftKey) {
				return
			} else if (event.key !== keystroke.symbol) {
				return
			}

			action()
			event.stopPropagation();
			event.preventDefault();
		};
	
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [name, action]);
}
