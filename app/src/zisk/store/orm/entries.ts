import { JournalEntry } from "@/schema/documents/JournalEntry"
import { createDocumentStore } from "../support/useDocumentStore"

export const useJournalEntryStore = createDocumentStore<JournalEntry>()

export const useJournalEntries = () => useJournalEntryStore((state) => state.items)
export const useSetJournalEntries = () => useJournalEntryStore((state) => state.setItems)
