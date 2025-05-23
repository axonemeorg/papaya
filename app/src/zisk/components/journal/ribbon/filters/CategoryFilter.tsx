import CategoryAutocomplete from '@/components/input/CategoryAutocomplete'
import { JournalFilterContext } from '@/contexts/JournalFilterContext'
import { useContext } from 'react'

export default function CategoryFilter() {
  const journalFilterContext = useContext(JournalFilterContext)

  const categoryIds = journalFilterContext?.activeJournalMemoryFilters?.CATEGORIES?.categoryIds ?? []

  const handleChangeCategoryIds = (ids: string[]) => {
    journalFilterContext?.updateJournalMemoryFilters((prev) => ({
      ...prev,
      CATEGORIES: {
        categoryIds: ids,
      },
    }))
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
