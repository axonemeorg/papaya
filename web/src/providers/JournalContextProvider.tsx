import { JournalEditorView } from "@/components/journal/JournalEditor";
import CreateJournalEntryModal from "@/components/modal/CreateJournalEntryModal";
import { JournalContext } from "@/contexts/JournalContext";
import { getCategories, getEnhancedJournalEntries, getEntryTags } from "@/database/queries";
import { Category, EnhancedJournalEntry, EntryTag } from "@/types/schema";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";

export default function JournalContextProvider(props: PropsWithChildren) {
    const [showCreateJournalEntryModal, setShowCreateJournalEntryModal] = useState<boolean>(false);
    const [createJournalEntryInitialDate, setCreateJournalEntryInitialDate] = useState<string | undefined | null>(null);

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

    const openCreateEntryModal = (date?: string) => {
        setCreateJournalEntryInitialDate(date);
        setShowCreateJournalEntryModal(true);
    }

    return (
        <JournalContext.Provider
            value={{
                getCategoriesQuery,
                getEntryTagsQuery,
                openCreateEntryModal,
            }}
        >
            <CreateJournalEntryModal
                open={showCreateJournalEntryModal}
                onClose={() => setShowCreateJournalEntryModal(false)}
                onSaved={() => {
                    // getEnhancedJournalEntriesQuery.refetch();
                    setShowCreateJournalEntryModal(false);
                }}
                initialDate={createJournalEntryInitialDate}
            />
            {props.children}
        </JournalContext.Provider>
    );
}
