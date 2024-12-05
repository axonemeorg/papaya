import { JournalEditorState, JournalEntryContext } from "@/contexts/JournalEntryContext";
import { getEnhancedJournalEntries } from "@/database/queries";
import { EnhancedJournalEntry } from "@/types/schema";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

type JournalEntryContextProviderProps = PropsWithChildren<JournalEditorState>;

export default function JournalEntryContextProvider(props: JournalEntryContextProviderProps) {
    const {
        view,
        date,
        setDate,
        onNextPage,
        onPrevPage,
    } = props;

    const getEnhancedJournalEntriesQuery = useQuery<Record<EnhancedJournalEntry['_id'], EnhancedJournalEntry>>({
        queryKey: ['enhancedJournalEntries', view, date],
        queryFn: async () => getEnhancedJournalEntries(view, date),
        initialData: {},
        enabled: true,
    });

    return (
        <JournalEntryContext.Provider
            value={{
                view,
                date,
                setDate,
                onNextPage,
                onPrevPage,
                getEnhancedJournalEntriesQuery,
            }}
        >
            {props.children}
        </JournalEntryContext.Provider>
    )
}
