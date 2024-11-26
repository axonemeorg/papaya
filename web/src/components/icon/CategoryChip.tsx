import { Category } from "@/types/schema";
import { alpha, Chip } from "@mui/material";

interface CategoryChipProps {
    category?: Category;
}

export default function CategoryChip(props: CategoryChipProps) {
    const categoryColor = props.category?.avatar.primaryColor;

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
