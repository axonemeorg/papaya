import AvatarChip from "@/components/icon/AvatarChip"
import { JournalContext } from "@/contexts/JournalContext"
import { JournalSliceContext } from "@/contexts/JournalSliceContext"
import { Category } from "@/types/schema"
import { Add } from "@mui/icons-material"
import { Collapse, IconButton, Stack } from "@mui/material"
import { useContext, useRef, useState } from "react"
import JournalFilterPicker from "./JournalFilterPicker"


export default function JournalFilterRibbon() {
    const [showFiltersMenu, setShowFiltersMenu] = useState<boolean>(false)
    const filtersMenuButtonRef = useRef<HTMLButtonElement | null>(null)

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
        <>
            <JournalFilterPicker
                anchorEl={filtersMenuButtonRef.current}
                open={showFiltersMenu}
                onClose={() => setShowFiltersMenu(false)}
            />
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
                    <IconButton size='small' ref={filtersMenuButtonRef} onClick={() => setShowFiltersMenu((showing) => !showing)}>
                        <Add fontSize="small" sx={(theme) => ({ color: theme.palette.text.secondary })}/>
                    </IconButton>
                </Stack>
            </Collapse>
        </>
    )
}
