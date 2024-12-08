import { Category } from '@/types/schema'
import { alpha, Chip } from '@mui/material'

interface CategoryChipProps {
	category?: Category
	contrast?: boolean
}

export default function CategoryChip(props: CategoryChipProps) {
	const categoryColor = props.category?.avatar.primaryColor

	console.log(props)

	return (
		<Chip
			size="small"
			sx={(theme) => {
				let background = undefined;
				let color = undefined;
				if (categoryColor) {
					if (props.contrast) {
						background = categoryColor;
						// use contrast color
						color = theme.palette.getContrastText(categoryColor);
					} else {
						background = alpha(categoryColor, 0.125);
						color = categoryColor;
					}
				}
				
				return {
					color,
					background,
					fontWeight: 500,
				}
			}}
			label={props.category?.label}
		/>
	)
}
