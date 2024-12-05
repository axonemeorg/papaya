import { JournalEditorView } from "@/components/journal/JournalEditor";
import { JournalContext } from "@/contexts/JournalContext";
import { getCategories, getEnhancedJournalEntries, getEntryTags } from "@/database/queries";
import { Category, EnhancedJournalEntry, EntryTag } from "@/types/schema";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

export default function JournalContextProvider(props: PropsWithChildren) {
    const view: JournalEditorView = 'week';
    const date: string = '2024-12-04';

    const getCategoriesQuery = useQuery<Record<Category['_id'], Category>>({
        queryKey: ['categories'],
        queryFn: getCategories,
        initialData: {},
    });

    const getEntryTagsQuery = useQuery<Record<EntryTag['_id'], EntryTag>>({
        queryKey: ['entryTags'],
        queryFn: getEntryTags,
        initialData: {},
    });

    const getEnhancedJournalEntriesQuery = useQuery<Record<EnhancedJournalEntry['_id'], EnhancedJournalEntry>>({
        queryKey: ['enhancedJournalEntries'],
        queryFn: async () => getEnhancedJournalEntries(view, date),
        initialData: {},
        enabled: true,
    });

    return (
        <JournalContext.Provider
            value={{
                getCategoriesQuery,
                getEntryTagsQuery,
                getEnhancedJournalEntriesQuery
            }}
        >
            {props.children}
        </JournalContext.Provider>
    );
}
