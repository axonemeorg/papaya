import { alpha, Chip } from "@mui/material";
import { getMuiColor } from "../color/ColorPicker";
import { Category } from "@/types/get";

interface CategoryChipProps {
    category: Category;
}

export default function CategoryChip(props: CategoryChipProps) {
    const categoryColor = getMuiColor(props.category.color);

    return (
        <Chip
            size='small'
            sx={{
                color: categoryColor,
                background: alpha(categoryColor, 0.125),
                fontWeight: 500
            }}
            label={props.category.label}
        />
    )
}