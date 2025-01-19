import { useEffect, useState } from 'react'
import SearchModal from './SearchModal'
import SearchLaunchButton from './SearchLaunchButton'

export default function SearchWidget() {
	const [showSearchModal, setShowSearchModal] = useState<boolean>(false)

	// TODO change this to use new context
	// useEffect(() => {
	// 	// Add event listener to open search when user presses '/' key
	// 	const handleKeyDown = (event: KeyboardEvent) => {
	// 		const activeElement = document.activeElement as HTMLElement;
	
	// 		// Check if the focused element is an input, textarea, or contenteditable
	// 		const isEditable =
	// 			activeElement.tagName === 'INPUT' ||
	// 			activeElement.tagName === 'TEXTAREA' ||
	// 			activeElement.isContentEditable;
	
	// 		if (!isEditable && event.key === '/') {
	// 			setShowSearchModal(true);
	// 			event.stopPropagation();
	// 			event.preventDefault();
	// 		}
	// 	};
	
	// 	document.addEventListener('keydown', handleKeyDown);
	// 	return () => document.removeEventListener('keydown', handleKeyDown);
	// }, [setShowSearchModal]); // Added dependency
	

	return (
		<>
			<SearchModal
				open={showSearchModal}
				onClose={() => setShowSearchModal(false)}
				placeholderText='Search for journal entries and more...'
			/>
			<SearchLaunchButton
				placeholderText="Search"
				onOpen={() => setShowSearchModal(true)}
			/>
		</>
	)
}
