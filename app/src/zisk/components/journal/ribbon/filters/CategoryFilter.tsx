import CategoryAutocomplete from "@/components/input/CategoryAutocomplete";
import { JournalSliceContext } from "@/contexts/JournalSliceContext";
import { useContext } from "react";

export default function CategoryFilter() {
    const journalSliceContext = useContext(JournalSliceContext)

    const categoryIds = journalSliceContext.categoryIds ?? []

    const handleChangeCategoryIds = (ids: string[]) => {
        journalSliceContext.onChangeCategoryIds(ids.length === 0 ? undefined : ids)
    }

    return (
        <CategoryAutocomplete
            size="small"
            value={categoryIds}
            onChange={(_event, newValue) => handleChangeCategoryIds(newValue)}
        />
    )
}
