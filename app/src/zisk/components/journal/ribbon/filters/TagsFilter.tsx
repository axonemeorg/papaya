import EntryTagAutocomplete from "@/components/input/EntryTagAutocomplete";
import { JournalFilterContext } from "@/contexts/JournalFilterContext";
import { useContext } from "react";

export default function TagsFilter() {
    const journalFilterContext = useContext(JournalFilterContext)

    const tagIds = journalFilterContext?.activeJournalMemoryFilters?.TAGS?.tagIds ?? []

    const handleChangeTagIds = (ids: string[]) => {
        journalFilterContext?.updateJournalMemoryFilters((prev) => ({
            ...prev,
            TAGS: {
                tagIds: ids,
            }
        }))
    }

    return (
        <EntryTagAutocomplete
            size="small"
            multiple
            value={tagIds}
            onChange={(_event, newValue) => handleChangeTagIds(newValue)}
        />
    )
}
