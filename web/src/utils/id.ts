const generateGenericUniqueId = () => {
    return crypto.randomUUID();
}

export const generateJournalEntryId = generateGenericUniqueId;
export const generateCategoryId = generateGenericUniqueId;
export const generateArtifactId = generateGenericUniqueId;
