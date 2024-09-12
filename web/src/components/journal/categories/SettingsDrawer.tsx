import CategoryIcon from "@/components/icon/CategoryIcon";
import { CategoryContext } from "@/contexts/CategoryContext";
import { Category } from "@/types/get";
import { Box, Drawer, List, ListItemIcon, ListItemText, MenuItem, Typography } from "@mui/material";
import { useContext } from "react";

interface SettingsDrawerProps {
    open: boolean;
    onClose: () => void;
}

export default function SettingsDrawer(props: SettingsDrawerProps) {
    const { categories } = useContext(CategoryContext);


    const handleSelectCategory = (category: Category) => {
        // 
    }

    return (
        <Drawer
            open={props.open}
            onClose={() => props.onClose()}
            anchor="right"
        >
            <Box p={4} sx={{ width: '320px' }}>
                <Typography variant='h6'>Categories</Typography>
                <List dense>
                    {categories.map((category) =>  {
                        return (
                            <MenuItem onClick={() => handleSelectCategory(category)} key={category.categoryId}>
                                <ListItemIcon>
                                    {/* <Icon color={category.avatarPrimaryColor}>{category.</Icon> */}
                                    <CategoryIcon category={category} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={category.label}
                                    secondary={category.description}
                                />
                            </MenuItem>
                        )
                    })}
                </List>

            </Box>
        </Drawer>
    )
}