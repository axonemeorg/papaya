import { nanoid } from 'nanoid'

export const generateGenericUniqueId = () => {
	return nanoid()
}

export const generateJournalEntryId = generateGenericUniqueId
export const generateCategoryId = generateGenericUniqueId
export const generateEntryTagId = generateGenericUniqueId
export const generateArtifactId = generateGenericUniqueId
export const generateJournalId = generateGenericUniqueId
