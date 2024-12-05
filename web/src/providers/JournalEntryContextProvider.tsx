import CreateJournalEntryModal from "@/components/modal/CreateJournalEntryModal";
import { JournalEditorState, JournalEntryContext } from "@/contexts/JournalEntryContext";
import { getEnhancedJournalEntries } from "@/database/queries";
import { EnhancedJournalEntry } from "@/types/schema";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";

type JournalEntryContextProviderProps = PropsWithChildren<JournalEditorState>;

export default function JournalEntryContextProvider(props: JournalEntryContextProviderProps) {
    const {
        view,
        date,
        setDate,
        onNextPage,
        onPrevPage,
    } = props;

    const [showCreateJournalEntryModal, setShowCreateJournalEntryModal] = useState<boolean>(false);
    const [createJournalEntryInitialDate, setCreateJournalEntryInitialDate] = useState<string | undefined | null>(date);

    const getEnhancedJournalEntriesQuery = useQuery<Record<EnhancedJournalEntry['_id'], EnhancedJournalEntry>>({
        queryKey: ['enhancedJournalEntries', view, date],
        queryFn: async () => getEnhancedJournalEntries(view, date),
        initialData: {},
        enabled: true,
    });

    const openCreateEntryModal = (date?: string) => {
        setCreateJournalEntryInitialDate(date);
        setShowCreateJournalEntryModal(true);
    }

    return (
        <JournalEntryContext.Provider
            value={{
                view,
                date,
                setDate,
                onNextPage,
                onPrevPage,
                getEnhancedJournalEntriesQuery,
                openCreateEntryModal,
            }}
        >
            <CreateJournalEntryModal
                open={showCreateJournalEntryModal}
                onClose={() => setShowCreateJournalEntryModal(false)}
                onSaved={() => {
                    getEnhancedJournalEntriesQuery.refetch();
                    setShowCreateJournalEntryModal(false);
                }}
                initialDate={createJournalEntryInitialDate}
            />
            {props.children}
        </JournalEntryContext.Provider>
    )
}
