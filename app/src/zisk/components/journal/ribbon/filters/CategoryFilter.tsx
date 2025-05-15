import CategoryAutocomplete from "@/components/input/CategoryAutocomplete";
import { JournalSnapshotContext } from "@/contexts/JournalSnapshopContext";
import { useContext } from "react";
import { JournalFilterSlot } from "../JournalFilterPicker";

export default function CategoryFilter() {
    const journalSnapshotContext = useContext(JournalSnapshotContext)

    const categoryIds = journalSnapshotContext.memoryFilters[JournalFilterSlot.CATEGORIES] as string[] || []

    const handleChangeCategoryIds = (ids: string | string[] | null) => {
        if (!Array.isArray(ids) || !ids) {
            return
        }
        journalSnapshotContext.setMemoryFilter(JournalFilterSlot.CATEGORIES, ids.length === 0 ? undefined : ids)
    }

    return (
        <CategoryAutocomplete
            size="small"
            multiple
            value={categoryIds}
            onChange={(_event, newValue) => handleChangeCategoryIds(newValue)}
        />
    )
}
