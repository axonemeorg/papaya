import { JournalEntry } from "@/schema/documents/JournalEntry";
import { DateView } from "@/schema/support/slice";
import { getAbsoluteDateRangeFromDateView } from "@/utils/date";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { JournalContext } from "./JournalContext";
import { getJournalEntries } from "@/database/queries";


export interface JournalSnapshotContext {
    isLoading: boolean;
}

const JournalSnapshotContext = createContext<JournalSnapshotContext>({
    isLoading: false,
})

interface RouterFilters {
    dateView: DateView
}

interface JournalSnapshotContextProviderProps extends PropsWithChildren {
    routerFilters: Partial<RouterFilters>
}

interface DownstreamFilters {

}

export default function JournalSnapshotContextProvider(props: PropsWithChildren) {

    const { activeJournalId } = useContext(JournalContext)
    const hasMinimalUpstreamFilters = Boolean(activeJournalId)

    const upstreamJournalEntryQuery = useQuery<JournalEntry[]>({
        queryKey: [],
        queryFn: async (): Promise<JournalEntry[]> => {
            return getJournalEntriesByUpstreamFilters()
        },
        initialData: [],
        enabled: hasMinimalUpstreamFilters,
    })

    const downstreamJournalEntryQuery = useQuery<JournalEntry[]>({
        queryKey: [],
        queryFn: async (): Promise<void> => {
            return
        },
        initialData: [],
        enabled: todo,

    })

    const filters = useMemo(() => {

    }, [])


    const contextValue: JournalSnapshotContext = {

    }
    
    return (
        <JournalSnapshotContext.Provider value={contextValue}>
            {props.children}
        </JournalSnapshotContext.Provider>
    )
}
