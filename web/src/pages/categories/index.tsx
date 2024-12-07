import ManageCategories from '@/components/journal/categories/ManageCategories'
import { getLayout } from '@/layouts/main'

const CategoriesPage = () => {
	return (
		<ManageCategories onClose={() => {}} />
	)
}

CategoriesPage.getLayout = getLayout

export default CategoriesPage
