import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { JournalContext } from "../contexts/JournalContext";
import { getJournalEntriesByUpstreamFilters } from "@/database/queries";
import { SearchFacetGroups, SearchFacets } from "@/schema/support/search/facet";
import z from "zod";
import { JournalFilterContext, MemoryFilters, RouterFilters } from "@/contexts/JournalFilterContext";
import { JournalEntry } from "@/schema/documents/JournalEntry";


interface JournalFilterContextProviderProps extends PropsWithChildren {
    routerFilters: RouterFilters
}

export default function JournalFilterContextProvider(props: JournalFilterContextProviderProps) {
    const [memoryFilters, setMemoryFilters] = useState<Partial<MemoryFilters>>({})

    const updateJournalMemoryFilters = (filters: Partial<MemoryFilters>) => {
        setMemoryFilters((prev) => ({
            ...prev,
            ...filters,
        }))
    }
    
    const activeJournalFilters: Partial<SearchFacets> = useMemo(() => {
        return {
            ...props.routerFilters,
        }
    }, [props.routerFilters])

    const contextValue: JournalFilterContext = {
        activeJournalFilters,
        activeJournalMemoryFilters: memoryFilters,
        updateJournalMemoryFilters,
    }
    
    return (
        <JournalFilterContext.Provider value={contextValue}>
            {props.children}
        </JournalFilterContext.Provider>
    )
}
