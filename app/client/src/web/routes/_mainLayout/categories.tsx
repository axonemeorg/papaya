import ManageCategories from '@/components/journal/categories/ManageCategories'
import { Container } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

const CategoriesPage = () => {
  return (
    <Container maxWidth="xl" disableGutters sx={{ pt: 1, pl: 1, pr: 3 }}>
      <ManageCategories />
    </Container>
  )
}

export const Route = createFileRoute('/_mainLayout/categories')({
  component: CategoriesPage,
})
