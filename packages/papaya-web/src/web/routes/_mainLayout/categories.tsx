import ManageCategories from '@/components/journal/categories/ManageCategories'
import { createFileRoute } from '@tanstack/react-router'

const CategoriesPage = () => {
  return <ManageCategories />
}

export const Route = createFileRoute('/_mainLayout/categories')({
  component: CategoriesPage,
})
