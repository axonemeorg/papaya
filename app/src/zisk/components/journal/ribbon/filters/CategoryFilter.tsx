import CategoryAutocomplete from "@/components/input/CategoryAutocomplete";
import { JournalSliceContext } from "@/contexts/JournalSliceContext";
import { useContext } from "react";

export default function CategoryFilter() {
    const journalSliceContext = useContext(JournalSliceContext)

    const categoryIds = journalSliceContext.categoryIds ?? []

    const handleChangeCategoryIds = (ids: string | string[] | null) => {
        if (!Array.isArray(ids) || !ids) {
            return
        }
        journalSliceContext.onChangeCategoryIds(ids.length === 0 ? undefined : ids)
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
