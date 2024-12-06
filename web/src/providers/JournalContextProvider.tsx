import ManageJournalsModal from "@/components/journal/ManageJournalsModal";
import { JournalContext } from "@/contexts/JournalContext";
import { updateActiveJournal } from "@/database/actions";
import { getDatabaseClient } from "@/database/client";
import { getCategories, getEntryTags, getJournals, getOrCreateZiskMeta } from "@/database/queries";
import { Category, EntryTag, JournalMeta, ZiskMeta } from "@/types/schema";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, useEffect, useState } from "react";


const db = getDatabaseClient();

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
    const [showManageJournalsModal, setShowManageJournalsModal] = useState<boolean>(false);
    const [manageJournalsModalInitialMode, setManageJournalsModalInitialMode] = useState<'SELECT' | 'CREATE'>('SELECT');
    const [createEntryInitialDate, setCreateEntryInitialDate] = useState<string | undefined | null>(null);
    const [activeJournal, setActiveJournal] = useState<JournalMeta | null>(null);

    const hasSelectedJournal = Boolean(activeJournal);

    const getZiskMetaQuery = useQuery<ZiskMeta | null>({
        queryKey: ['ziskMeta'],
        queryFn: getOrCreateZiskMeta,
        initialData: null,
        enabled: true,
    });

    const getJournalsQuery = useQuery<Record<JournalMeta['_id'], JournalMeta>>({
        queryKey: ['journals'],
        queryFn: getJournals,
        initialData: {},
    });

    const getCategoriesQuery = useQuery<Record<Category['_id'], Category>>({
        queryKey: ['categories'],
        queryFn: getCategories,
        initialData: {},
        enabled: hasSelectedJournal,
    });

    const getEntryTagsQuery = useQuery<Record<EntryTag['_id'], EntryTag>>({
        queryKey: ['entryTags'],
        queryFn: getEntryTags,
        initialData: {},
        enabled: hasSelectedJournal,
    });

    const openCreateEntryModal = (date?: string) => {
        setCreateEntryInitialDate(date);
        setShowCreateJournalEntryModal(true);
    }

    const promptCreateJournal = () => {
        setManageJournalsModalInitialMode('CREATE');
        setShowManageJournalsModal(true);
    }

    const promptSelectJournal = () => {
        setManageJournalsModalInitialMode('SELECT');
        setShowManageJournalsModal(true);
    }

    const handleSelectJournal = (journal: JournalMeta) => {
        setActiveJournal(journal);
        updateActiveJournal(journal._id);
    }

    useEffect(() => {
        if (!activeJournal) {
            return;
        }
        setShowManageJournalsModal(false);
    }, [activeJournal]);

    useEffect(() => {
        if (!getZiskMetaQuery.data || !getJournalsQuery.data) {
            return;
        } else if (!getZiskMetaQuery.isFetched || !getJournalsQuery.isFetched) {
            return;
        }
        const numJournals = Object.keys(getJournalsQuery.data).length;
        if (numJournals === 0) {
            promptCreateJournal();
        } else {
            const activeJournalId = getZiskMetaQuery.data.activeJournalId;
            const journal = activeJournalId ? getJournalsQuery.data[activeJournalId] : null;
            if (!journal) {
                promptSelectJournal();
            } else {
                setActiveJournal(journal);
            }                
        }
    }, [getZiskMetaQuery.data, getZiskMetaQuery.isFetched, getJournalsQuery.data, getJournalsQuery.isFetched]);

    return (
        <JournalContext.Provider
            value={{
                getCategoriesQuery,
                getEntryTagsQuery,
                createEntryInitialDate,
                openCreateEntryModal,
                showCreateJournalEntryModal,
                closeCreateEntryModal: () => setShowCreateJournalEntryModal(false),
                journal: activeJournal,
                getJournalsQuery,
                openJournalManager: () => promptSelectJournal(),
            }}
        >
            <ManageJournalsModal
                open={showManageJournalsModal}
                initialMode={manageJournalsModalInitialMode}
                onClose={() => setShowManageJournalsModal(false)}
                onSelect={handleSelectJournal}
            />
            {props.children}
        </JournalContext.Provider>
    );
}
