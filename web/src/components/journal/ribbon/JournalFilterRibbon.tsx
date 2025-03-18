import AvatarChip from "@/components/icon/AvatarChip"
import { JournalContext } from "@/contexts/JournalContext"
import { JournalSliceContext } from "@/contexts/JournalSliceContext"
import { Category } from "@/types/schema"
import { Collapse, Stack } from "@mui/material"
import { useContext } from "react"


export default function JournalFilterRibbon() {
    const journalSliceContext = useContext(JournalSliceContext)

    const numFilters = journalSliceContext.getSliceFilterCount()

    const { getCategoriesQuery } = useContext(JournalContext)

    const categoies: Category[] = !journalSliceContext.categoryIds
        ? []
        : journalSliceContext.categoryIds
            .filter(Boolean)
            .map((categoryId) => getCategoriesQuery.data[categoryId])
            .filter(Boolean)

    const handleRemoveCategory = (categoryId: string) => {
        const newCategoryIds = (journalSliceContext.categoryIds ?? [])
            .filter((id) => id !== categoryId)

        journalSliceContext.onChangeCategoryIds(newCategoryIds.length > 0 ? newCategoryIds : undefined)
    }

    return (
        <Collapse in={numFilters > 0}>
            <Stack direction='row' sx={{ flexFlow: 'row wrap', px: 2, py: 1 }} gap={0.5}>
                {categoies.map((category) => {
                    return (
                        <AvatarChip
                            key={category._id}
                            avatar={category.avatar}
                            label={category.label}
                            icon
                            // contrast
                            onDelete={() => handleRemoveCategory(category._id)}
                        />
                    )
                })}
            </Stack>
        </Collapse>
    )
}
