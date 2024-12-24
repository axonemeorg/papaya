import { useState } from 'react'
import SearchModal from './SearchModal'
import SearchLaunchButton from './SearchLaunchButton'

export default function SearchWidget() {
	const [showSearchModal, setShowSearchModal] = useState<boolean>(false)
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
