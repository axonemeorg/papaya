import { JournalEditorView } from "@/components/journal/JournalEditor";
import { EnhancedJournalEntry } from "@/types/schema";
import { DefinedUseQueryResult } from "@tanstack/react-query";
import { createContext } from "react";

export interface ______SomeInterfaceName {
    view: JournalEditorView;
    date: string;
    // TODO not sure if setView should be supported
    // setView: (view: JournalEditorView) => void;
    setDate: (date: string) => void;
    onNextPage: () => void;
    onPrevPage: () => void;
}

interface JournalEntryContext extends ______SomeInterfaceName {
    
    getEnhancedJournalEntriesQuery: DefinedUseQueryResult<Record<EnhancedJournalEntry['_id'], EnhancedJournalEntry>, Error>;
}

export const JournalEntryContext = createContext<JournalEntryContext>({} as JournalEntryContext);