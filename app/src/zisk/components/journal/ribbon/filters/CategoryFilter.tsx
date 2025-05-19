import CategoryAutocomplete from "@/components/input/CategoryAutocomplete";
import { JournalFilterContext } from "@/contexts/JournalFilterContext";
import { useContext } from "react";

export default function CategoryFilter() {
    const journalFilterContext = useContext(JournalFilterContext)

    const handleChangeCategoryIds = (ids: string | string[] | null) => {
        throw new Error("not implemented")
        if (!Array.isArray(ids) || !ids) {
            return
        }
        // journalSliceContext.onChangeCategoryIds(ids.length === 0 ? undefined : ids)
    }

    return (
        <CategoryAutocomplete
            size="small"
            multiple
            // value={categoryIds}
            onChange={(_event, newValue) => handleChangeCategoryIds(newValue)}
        />
    )
}
