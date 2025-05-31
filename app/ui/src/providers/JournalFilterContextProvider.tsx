import { JournalFilterContext, MemoryFilters, RouterFilters } from '@ui/contexts/JournalFilterContext'
import { SearchFacets } from '@ui/schema/support/search/facet'
import { PropsWithChildren, useMemo, useState } from 'react'

interface JournalFilterContextProviderProps extends PropsWithChildren {
  routerFilters: RouterFilters
}

export default function JournalFilterContextProvider(props: JournalFilterContextProviderProps) {
  const [memoryFilters, setMemoryFilters] = useState<Partial<MemoryFilters>>({})

  const activeJournalFilters: Partial<SearchFacets> = useMemo(() => {
    const next = {
      ...props.routerFilters,
      ...memoryFilters,
    }
    console.log('next activeJournalFilters:', next)
    return next
  }, [props.routerFilters, memoryFilters])

  const contextValue: JournalFilterContext = {
    activeJournalFilters,
    activeJournalMemoryFilters: memoryFilters,
    updateJournalMemoryFilters: setMemoryFilters,
  }

  return <JournalFilterContext.Provider value={contextValue}>{props.children}</JournalFilterContext.Provider>
}
