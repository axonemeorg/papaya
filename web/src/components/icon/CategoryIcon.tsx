import { Category } from "@/types/get";
import { Icon } from "@mui/material";


interface CategoryIconProps {
	category?: Category;
}

export default function CategoryIcon(props: CategoryIconProps) {
	const categoryColor = props.category?.avatarPrimaryColor;

	return (
		<Icon sx={{ color: categoryColor}}>{props.category?.avatarContent}</Icon>
	);
}