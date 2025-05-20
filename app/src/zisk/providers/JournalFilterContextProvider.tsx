import { PropsWithChildren, useMemo, useState } from "react";
import { SearchFacets } from "@/schema/support/search/facet";
import { JournalFilterContext, MemoryFilters, RouterFilters } from "@/contexts/JournalFilterContext";


interface JournalFilterContextProviderProps extends PropsWithChildren {
    routerFilters: RouterFilters
}

export default function JournalFilterContextProvider(props: JournalFilterContextProviderProps) {
    const [memoryFilters, setMemoryFilters] = useState<Partial<MemoryFilters>>({})

    const activeJournalFilters: Partial<SearchFacets> = useMemo(() => {
        return {
            ...props.routerFilters,
            ...memoryFilters,
        }
    }, [props.routerFilters, memoryFilters])

    const contextValue: JournalFilterContext = {
        activeJournalFilters,
        activeJournalMemoryFilters: memoryFilters,
        updateJournalMemoryFilters: setMemoryFilters,
    }
    
    return (
        <JournalFilterContext.Provider value={contextValue}>
            {props.children}
        </JournalFilterContext.Provider>
    )
}
