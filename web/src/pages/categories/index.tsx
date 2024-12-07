import ManageCategories from '@/components/journal/categories/ManageCategories'
import { getLayout } from '@/layouts/main'
import { Container } from '@mui/material'

const CategoriesPage = () => {
	return (
		<Container maxWidth="xl" sx={{ pt: 2 }}>
			<ManageCategories onClose={() => {}} />
		</Container>
	)
}

CategoriesPage.getLayout = getLayout

export default CategoriesPage
