import { Category } from '@/types/schema'
import { alpha, Chip, Icon, useTheme } from '@mui/material'
import AvatarIcon from './AvatarIcon'

interface CategoryChipProps {
	category?: Category
	contrast?: boolean
	icon?: boolean
}

export default function CategoryChip(props: CategoryChipProps) {
	const categoryColor = props.category?.avatar.primaryColor
	const theme = useTheme()

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

	return (
		<Chip
			size={props.icon ? undefined : "small"}
			sx={{				
				color,
				background,
				fontWeight: 500,
			}}
			label={props.category?.label}
			icon={props.icon && props.category ? (
				<Icon>
					<AvatarIcon avatar={props.category.avatar} sx={{ color: `${color} !important` }} />
				</Icon>
			) : undefined}
		/>
	)
}
