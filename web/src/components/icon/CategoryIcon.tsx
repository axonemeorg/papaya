import { Category } from "@/types/get";
import { getMuiColor } from "../color/ColorPicker";
import { Icon } from "@mui/material";


interface CategoryIconProps {
	category: Category;
}

export default function CategoryIcon(props: CategoryIconProps) {
	const categoryColor = getMuiColor(props.category.color);

	return (
		<Icon sx={{ color: categoryColor}}>{props.category.icon}</Icon>
	);
}