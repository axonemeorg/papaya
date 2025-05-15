import { JournalEntry } from "@/schema/documents/JournalEntry";
import { AmountRange, DateView } from "@/schema/support/slice";
import { getAbsoluteDateRangeFromDateView } from "@/utils/date";
import { useQuery } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { JournalContext } from "./JournalContext";
import { getJournalEntries, getJournalEntriesByUpstreamFilters } from "@/database/queries";
import { JournalFilterSlot } from "@/components/journal/ribbon/JournalFilterPicker";
import { AmountFilter } from "@/filters/AmountFilter";
import { DateViewFilter } from "@/filters/DateViewFilter";
import { AttributeFilter, DownstreamAttributeFilter, UpstreamAttributeFilter } from "@/filters/support/AttributeFilter";

// Type for filter values by slot
export type FilterValues = {
    [JournalFilterSlot.AMOUNT]?: AmountRange;
    [JournalFilterSlot.DATE_RANGE]?: DateView;
    [JournalFilterSlot.CATEGORIES]?: string[];
    [JournalFilterSlot.ATTACHMENTS]?: boolean;
    [JournalFilterSlot.TAGS]?: string[];
}

// Type for filter implementation registry
type FilterImplementation<T> = {
    createFilter: (value: T) => AttributeFilter<T>;
    preferDownstream: boolean;
}

// Filter registry that maps slots to their implementations
const filterRegistry: Record<JournalFilterSlot, FilterImplementation<any>> = {
    [JournalFilterSlot.AMOUNT]: {
        createFilter: (value: AmountRange) => new AmountFilter(value),
        preferDownstream: true // Prefer downstream for amount filters
    },
    [JournalFilterSlot.DATE_RANGE]: {
        createFilter: (value: DateView) => new DateViewFilter(value),
        preferDownstream: false // Date filters are more efficient upstream
    },
    [JournalFilterSlot.CATEGORIES]: {
        createFilter: (value: string[]) => {
            // Simple implementation for categories filter
            class CategoryFilter extends AttributeFilter<string[]> {
                constructor(filter: string[]) {
                    super(filter);
                    
                    this.upstream = () => {
                        if (!this.filter || this.filter.length === 0) return null;
                        return [{
                            categoryId: {
                                $in: this.filter
                            }
                        }];
                    };
                    
                    this.downstream = (entries) => {
                        if (!this.filter || this.filter.length === 0) return null;
                        return entries.filter(entry => {
                            if (!entry.categoryId) return false;
                            return this.filter.includes(entry.categoryId);
                        });
                    };
                }
                
                serialize(): string {
                    return this.filter.join(',');
                }
            }
            
            return new CategoryFilter(value);
        },
        preferDownstream: false
    },
    [JournalFilterSlot.ATTACHMENTS]: {
        createFilter: (value: boolean) => {
            class AttachmentsFilter extends AttributeFilter<boolean> {
                constructor(filter: boolean) {
                    super(filter);
                    
                    this.upstream = () => {
                        return [{
                            _attachments: {
                                $exists: this.filter
                            }
                        }];
                    };
                    
                    this.downstream = (entries) => {
                        return entries.filter(entry => {
                            const hasAttachments = !!entry._attachments && Object.keys(entry._attachments || {}).length > 0;
                            return this.filter ? hasAttachments : !hasAttachments;
                        });
                    };
                }
                
                serialize(): string {
                    return this.filter ? 'true' : 'false';
                }
            }
            
            return new AttachmentsFilter(value);
        },
        preferDownstream: true
    },
    [JournalFilterSlot.TAGS]: {
        createFilter: (value: string[]) => {
            class TagsFilter extends AttributeFilter<string[]> {
                constructor(filter: string[]) {
                    super(filter);
                    
                    this.upstream = () => {
                        if (!this.filter || this.filter.length === 0) return null;
                        return [{
                            tagIds: {
                                $in: this.filter
                            }
                        }];
                    };
                    
                    this.downstream = (entries) => {
                        if (!this.filter || this.filter.length === 0) return null;
                        return entries.filter(entry => {
                            if (!entry.tagIds) return false;
                            return this.filter.some(id => entry.tagIds?.includes(id));
                        });
                    };
                }
                
                serialize(): string {
                    return this.filter.join(',');
                }
            }
            
            return new TagsFilter(value);
        },
        preferDownstream: false
    },
};

// Interface for filter sources
interface FilterSource {
    getFilter: <T>(slot: JournalFilterSlot) => T | undefined;
    hasFilter: (slot: JournalFilterSlot) => boolean;
}

export interface JournalSnapshotContext {
    isLoading: boolean;
    entries: JournalEntry[];
    memoryFilters: Partial<FilterValues>;
    routerFilters: Partial<FilterValues>;
    setMemoryFilter: <T>(slot: JournalFilterSlot, value: T | undefined) => void;
    clearMemoryFilter: (slot: JournalFilterSlot) => void;
    clearAllMemoryFilters: () => void;
    getActiveFilterSlots: () => Set<JournalFilterSlot>;
    refetch: () => void;
}

const JournalSnapshotContext = createContext<JournalSnapshotContext>({
    isLoading: false,
    entries: [],
    memoryFilters: {},
    routerFilters: {},
    setMemoryFilter: () => {},
    clearMemoryFilter: () => {},
    clearAllMemoryFilters: () => {},
    getActiveFilterSlots: () => new Set(),
    refetch: () => {},
});

interface RouterFilters {
    dateView: DateView
}

interface MemoryFilters {
    amount?: AmountRange;
    categories?: string[];
    attachments?: boolean;
    tags?: string[];
}

interface JournalSnapshotContextProviderProps extends PropsWithChildren {
    routerFilters: Partial<RouterFilters>
}

export default function JournalSnapshotContextProvider(props: JournalSnapshotContextProviderProps) {
    const { activeJournalId } = useContext(JournalContext);
    const [memoryFilters, setMemoryFilters] = useState<Partial<FilterValues>>({});

    // Create filter sources
    const memoryFilterSource: FilterSource = useMemo(() => ({
        getFilter: <T,>(slot: JournalFilterSlot): T | undefined => memoryFilters[slot] as T | undefined,
        hasFilter: (slot: JournalFilterSlot): boolean => slot in memoryFilters && memoryFilters[slot] !== undefined
    }), [memoryFilters]);

    const routerFilterSource: FilterSource = useMemo(() => ({
        getFilter: <T,>(slot: JournalFilterSlot): T | undefined => {
            if (slot === JournalFilterSlot.DATE_RANGE) {
                return props.routerFilters.dateView as T | undefined;
            }
            return undefined;
        },
        hasFilter: (slot: JournalFilterSlot): boolean => {
            if (slot === JournalFilterSlot.DATE_RANGE) {
                return !!props.routerFilters.dateView;
            }
            return false;
        }
    }), [props.routerFilters]);

    // Determine which filters should be applied upstream vs downstream
    const { upstreamFilters, downstreamFilters } = useMemo(() => {
        const upstream: UpstreamAttributeFilter[] = [];
        const downstream: DownstreamAttributeFilter[] = [];
        
        // Process all filter slots
        Object.values(JournalFilterSlot).forEach(slot => {
            // Skip non-implemented filters
            if (!filterRegistry[slot]) return;
            
            // Determine which source to use (memory takes precedence over router)
            let source: FilterSource | null = null;
            if (memoryFilterSource.hasFilter(slot)) {
                source = memoryFilterSource;
            } else if (routerFilterSource.hasFilter(slot)) {
                source = routerFilterSource;
            }
            
            if (!source) return;
            
            // Get the filter value and create the filter
            const value = source.getFilter(slot);
            if (value === undefined) return;
            
            const filterImpl = filterRegistry[slot];
            const filter = filterImpl.createFilter(value);
            
            // Decide whether to use upstream or downstream implementation
            if (filterImpl.preferDownstream) {
                const downstreamFilter = filter.downstream;
                if (downstreamFilter) downstream.push(downstreamFilter);
            } else {
                // We need to wrap the upstream filter result in a function to match the UpstreamAttributeFilter type
                upstream.push(filter.upstream);
            }
        });
        
        return { upstreamFilters: upstream, downstreamFilters: downstream };
    }, [memoryFilters, props.routerFilters, memoryFilterSource, routerFilterSource]);

    // Check if we have minimal filters to execute a query
    const hasMinimalUpstreamFilters: boolean = useMemo(() => {
        return Boolean(activeJournalId);
    }, [activeJournalId]);

    // Query for entries using upstream filters
    const upstreamJournalEntryQuery = useQuery<JournalEntry[]>({
        queryKey: ['journal-entries', activeJournalId, upstreamFilters],
        queryFn: async (): Promise<JournalEntry[]> => {
            if (!activeJournalId) return [];
            
            // If we have a dateView in router filters, ensure it's included in upstream filters
            const filters = [...upstreamFilters];
            
            // Check if we need to add date filter
            let hasDateFilter = false;
            for (const filter of upstreamFilters) {
                const result = filter();
                if (result && result.some(item => 'date' in item)) {
                    hasDateFilter = true;
                    break;
                }
            }
            
            if (props.routerFilters.dateView && !hasDateFilter) {
                const dateFilter = new DateViewFilter(props.routerFilters.dateView);
                // Add the date filter's upstream function
                filters.push(() => dateFilter.upstream());
            }
            
            const entries = await getJournalEntriesByUpstreamFilters(activeJournalId, filters);
            return Object.values(entries);
        },
        initialData: [],
        enabled: hasMinimalUpstreamFilters,
    });

    // Apply downstream filters to the results
    const filteredEntries = useMemo(() => {
        let entries = upstreamJournalEntryQuery.data || [];
        
        // Apply each downstream filter in sequence
        downstreamFilters.forEach(filter => {
            const result = filter(entries);
            if (result !== null) {
                entries = result;
            }
        });
        
        return entries;
    }, [upstreamJournalEntryQuery.data, downstreamFilters]);

    // Helper to set a memory filter
    const setMemoryFilter = <T,>(slot: JournalFilterSlot, value: T | undefined) => {
        setMemoryFilters(prev => ({
            ...prev,
            [slot]: value
        }));
    };

    // Helper to clear a memory filter
    const clearMemoryFilter = (slot: JournalFilterSlot) => {
        setMemoryFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[slot];
            return newFilters;
        });
    };

    // Helper to clear all memory filters
    const clearAllMemoryFilters = () => {
        setMemoryFilters({});
    };

    // Get active filter slots from both memory and router
    const getActiveFilterSlots = (): Set<JournalFilterSlot> => {
        const slots = new Set<JournalFilterSlot>();
        
        // Add memory filters
        Object.entries(memoryFilters).forEach(([slot, value]) => {
            if (value !== undefined) {
                slots.add(slot as JournalFilterSlot);
            }
        });
        
        // Add router filters
        if (props.routerFilters.dateView) {
            slots.add(JournalFilterSlot.DATE_RANGE);
        }
        
        return slots;
    };

    const contextValue: JournalSnapshotContext = {
        isLoading: upstreamJournalEntryQuery.isLoading,
        entries: filteredEntries,
        memoryFilters,
        routerFilters: {
            [JournalFilterSlot.DATE_RANGE]: props.routerFilters.dateView
        },
        setMemoryFilter,
        clearMemoryFilter,
        clearAllMemoryFilters,
        getActiveFilterSlots,
        refetch: upstreamJournalEntryQuery.refetch
    };
    
    return (
        <JournalSnapshotContext.Provider value={contextValue}>
            {props.children}
        </JournalSnapshotContext.Provider>
    );
}
