import { JournalEntry } from "@/types/get";
import { createContext } from "react";

export interface JournalEntryContext {
    journalEntries: JournalEntry[];
}

export const JournalEntryContext = createContext<JournalEntryContext>({
    journalEntries: []
});
