import { JournalContext } from "@/contexts/JournalContext";
import { getDatabaseClient } from "@/database/client";
import { getCategories, getEntryTags } from "@/database/queries";
import { Category, EntryTag } from "@/types/schema";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";


const db = getDatabaseClient();

// export interface ZiskJournalMeta {
//     _id: typeof ZISK_JOURNAL_META_KEY;
//     journalVersion: number;
// }

// const newMetaDoc: ZiskJournalMeta = {
//     _id: ZISK_JOURNAL_META_KEY,
//     journalVersion: 1,
// }


db.createIndex({
    index: {
        fields: [
            'type',
            'date',
            'parentEntryId',
        ]
    }
});

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
