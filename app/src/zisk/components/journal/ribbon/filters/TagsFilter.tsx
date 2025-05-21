import EntryTagAutocomplete from "@/components/input/EntryTagAutocomplete";
import { JournalFilterContext } from "@/contexts/JournalFilterContext";
import { StatusVariant } from "@/schema/models/EntryStatus";
import { discriminateEntryTags } from "@/utils/journal";
import { useContext } from "react";

export default function TagsFilter() {
    const journalFilterContext = useContext(JournalFilterContext)

    // Get both tag IDs and status IDs from the filter context
    const tagIds = journalFilterContext?.activeJournalMemoryFilters?.TAGS?.tagIds ?? []
    const statusIds = journalFilterContext?.activeJournalMemoryFilters?.TAGS?.statusIds ?? []
    
    // Combine them for display in the autocomplete
    const combinedIds = [...tagIds, ...statusIds]

    const handleChangeTagIds = (ids: string[]) => {
        // Separate entry tags from status tags
        const { entryTagIds, statusIds } = discriminateEntryTags(ids)
        
        journalFilterContext?.updateJournalMemoryFilters((prev) => {
            // If there are no tags or statuses, return the previous state without TAGS
            if (entryTagIds.length === 0 && statusIds.length === 0) {
                const next = { ...prev }
                delete next.TAGS
                return next
            }
            
            return {
                ...prev,
                TAGS: {
                    tagIds: entryTagIds,
                    statusIds: statusIds,
                }
            }
        })
    }

    return (
        <EntryTagAutocomplete
            size="small"
            multiple
            value={combinedIds}
            onChange={(_event, newValue) => handleChangeTagIds(newValue)}
        />
    )
}
