import { createContext } from 'react'

export interface JournalContext {
	activeJournalId: string | null;
	setActiveJournalId: (journalId: string | null) => void;
}

export const JournalContext = createContext<JournalContext>({} as JournalContext)
