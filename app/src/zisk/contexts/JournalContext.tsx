import { Account } from '@/schema/documents/Account'
import { Category } from '@/schema/documents/Category'
import { EntryTag } from '@/schema/documents/EntryTag'
import { Journal } from '@/schema/documents/Journal'
import { JournalEntry } from '@/schema/documents/JournalEntry'
import { DefinedUseQueryResult } from '@tanstack/react-query'
import { createContext } from 'react'
import { UseFormReturn } from 'react-hook-form'

export interface JournalContext {
	activeJournal: Journal | null;
	setActiveJournal: (journal: Journal | null) => void;
	queries: {
		accounts: DefinedUseQueryResult<Record<Account['_id'], Account>, Error>
		categories: DefinedUseQueryResult<Record<string, Category>, Error>
		journals: DefinedUseQueryResult<Record<Journal['_id'], Journal>, Error>
		tags: DefinedUseQueryResult<Record<EntryTag['_id'], EntryTag>, Error>
	},
}

export const JournalContext = createContext<JournalContext>({} as JournalContext)
