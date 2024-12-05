import { Category, EnhancedJournalEntry, EntryTag } from "@/types/schema";
import { DefinedUseQueryResult } from "@tanstack/react-query";
import { createContext } from "react";

export interface JournalContext {
    getCategoriesQuery: DefinedUseQueryResult<Record<Category['_id'], Category>, Error>;
    getEntryTagsQuery: DefinedUseQueryResult<Record<EntryTag['_id'], EntryTag>, Error>;
    getEnhancedJournalEntriesQuery: DefinedUseQueryResult<Record<EnhancedJournalEntry['_id'], EnhancedJournalEntry>, Error>;
}

export const JournalContext = createContext<JournalContext>({} as JournalContext);
