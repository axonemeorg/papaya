import { JournalEntry } from "@/schema/documents/JournalEntry";
import { useQuery } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { JournalContext } from "./JournalContext";
import { getJournalEntriesByUpstreamFilters } from "@/database/queries";
import { SearchFacetGroups, SearchFacets } from "@/schema/support/search/facet";
import z from "zod";


export interface JournalSnapshotContext {
    isLoading: boolean;
    filteredJournalEntries: Record<string, JournalEntry>
}

const JournalSnapshotContext = createContext<JournalSnapshotContext>({
    isLoading: false,
    filteredJournalEntries: {},
})

type RouterFilters = z.infer<typeof SearchFacetGroups.router>

interface JournalSnapshotContextProviderProps extends PropsWithChildren {
    routerFilters: RouterFilters
}

export default function JournalSnapshotContextProvider(props: JournalSnapshotContextProviderProps) {

    const { activeJournalId } = useContext(JournalContext)

    // const [memoryFilters, setMemoryFilters] = useState<Partial<MemoryFilters>>({})


    const activeJournalFilters: Partial<SearchFacets> = useMemo(() => {
        return {
            ...props.routerFilters,
        }
    }, [props.routerFilters])

    const hasMinimalUpstreamFilters: boolean = useMemo(() => {
        return Boolean(activeJournalId)
    }, [activeJournalFilters])

    const upstreamJournalEntryQuery = useQuery<Record<string, JournalEntry>>({
        queryKey: ['upstreamJournalEntries'],
        queryFn: async (): Promise<Record<string, JournalEntry>> => {
            const response = await getJournalEntriesByUpstreamFilters(
                activeJournalId!,
                activeJournalFilters
            )

            return response
        },
        initialData: {},
        enabled: hasMinimalUpstreamFilters,
    })

    // const downstreamJournalEntryQuery = useQuery<JournalEntry[]>({
    //     queryKey: [],
    //     queryFn: async (): Promise<void> => {
    //         // TODO
    //         return
    //     },
    //     initialData: [
    //         // TODO
    //     ],
    //     enabled: todo,

    // })


    const contextValue: JournalSnapshotContext = {
        isLoading: upstreamJournalEntryQuery.isLoading,
        filteredJournalEntries: upstreamJournalEntryQuery.data,
    }
    
    return (
        <JournalSnapshotContext.Provider value={contextValue}>
            {props.children}
        </JournalSnapshotContext.Provider>
    )
}
