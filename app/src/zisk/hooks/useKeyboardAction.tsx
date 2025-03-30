import { KEYBOARD_ACTIONS, KeyboardActionName } from "@/constants/keyboard";
import { useEffect } from "react"
import useBrowserPlatform from "./useBrowserPlatform";

interface UseKeyboardActionOptions {
	/**
	 * If `true`, then attempts to trigger the action from a textarea, input,
	 * or contenteditable target element will be ignored.
	 */
	ignoredByEditableTargets: boolean
}

const DEFAULT_OPTIONS: UseKeyboardActionOptions = {
	ignoredByEditableTargets: true
}

export default function useKeyboardAction(
	name: KeyboardActionName,
	action: (event: KeyboardEvent) => void,
	options: Partial<UseKeyboardActionOptions> = {}
): void {
	const restOptions: UseKeyboardActionOptions = { ...DEFAULT_OPTIONS, ...options }
	const { macOs } = useBrowserPlatform()

    useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const activeElement = document.activeElement as HTMLElement;
	
			// Check if the focused element is an input, textarea, or contenteditable
			const isEditable =
				activeElement.tagName === 'INPUT' ||
				activeElement.tagName === 'TEXTAREA' ||
				activeElement.isContentEditable;

			if (isEditable && options.ignoredByEditableTargets) {
                return
            }
            
            const keystroke = KEYBOARD_ACTIONS[name]
			if (keystroke.ctrlCmd) {
				if (macOs && !event.metaKey) {
					return
				} else if (!event.ctrlKey) {
					return
				}
			} else if (event.ctrlKey) {
				return
			} else if ((keystroke.altOpt && !event.altKey) || (!keystroke.altOpt && event.altKey)) {
				return
			} else if ((keystroke.shift && !event.shiftKey) || (!keystroke.shift && event.shiftKey)) {
				return
			} else if (event.key !== keystroke.symbol) {
				return
			}

			action(event)
			event.stopPropagation();
			event.preventDefault();
		};
	
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [name, action, restOptions]);
}
