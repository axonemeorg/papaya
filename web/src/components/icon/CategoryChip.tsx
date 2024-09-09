import { alpha, Chip } from "@mui/material";
import { getMuiColor } from "../color/ColorPicker";
import { Category } from "@/types/get";

interface CategoryChipProps {
    category?: Category;
}

export default function CategoryChip(props: CategoryChipProps) {
    const categoryColor = props.category?.avatarPrimaryColor ? getMuiColor(props.category.avatarPrimaryColor) : undefined;

    return (
        <Chip
            size='small'
            sx={{
                color: categoryColor,
                background: categoryColor ? alpha(categoryColor, 0.125) : undefined,
                fontWeight: 500
            }}
            label={props.category?.label}
        />
    )
}
