const generateGenericUniqueId = () => {
	// return crypto.randomUUID()
	return new Date().toISOString()
}

export const generateJournalEntryId = generateGenericUniqueId
export const generateCategoryId = generateGenericUniqueId
export const generateArtifactId = generateGenericUniqueId
export const generateJournalId = generateGenericUniqueId
