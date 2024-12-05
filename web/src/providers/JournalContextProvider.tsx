import { JournalContext } from "@/contexts/JournalContext";
import { getCategories, getEntryTags } from "@/database/queries";
import { Category, EntryTag } from "@/types/schema";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";

export default function JournalContextProvider(props: PropsWithChildren) {
    const [showCreateJournalEntryModal, setShowCreateJournalEntryModal] = useState<boolean>(false);
    const [createEntryInitialDate, setCreateEntryInitialDate] = useState<string | undefined | null>(null);

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
        setCreateEntryInitialDate(date);
        setShowCreateJournalEntryModal(true);
    }

    return (
        <JournalContext.Provider
            value={{
                getCategoriesQuery,
                getEntryTagsQuery,
                createEntryInitialDate,
                openCreateEntryModal,
                showCreateJournalEntryModal,
                closeCreateEntryModal: () => setShowCreateJournalEntryModal(false),
            }}
        >
            {props.children}
        </JournalContext.Provider>
    );
}
