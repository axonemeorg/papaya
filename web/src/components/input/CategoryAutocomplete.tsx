'use client'

import { Autocomplete, ListItem, ListItemIcon, ListItemText, Icon, TextField, AutocompleteProps, MenuItem } from "@mui/material";
import * as colors from '@mui/material/colors';
import { CSSProperties, useContext, useMemo } from "react";

import { type Category } from "@/types/get";
import { CategoryContext } from "@/contexts/CategoryContext";

type CategoryAutocompleteProps = 
    & Omit<AutocompleteProps<Category, false, false, false>, 'options' | 'renderInput'>
    & Partial<Pick<AutocompleteProps<Category, false, false, false>, 'options' | 'renderInput'>>

export default function CategoryAutocomplete(props: CategoryAutocompleteProps) {
    const { categories } = useContext(CategoryContext);

    return (
        <Autocomplete<Category>
            className='ai-effect'
            options={categories}
            isOptionEqualToValue={(option, value) => option.categoryId === value.categoryId}
            renderInput={(params) => <TextField {...params} label="Category" />}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                const [colorName, colorShade] = option.color.split('.');

                return (
                    <ListItem
                        dense
                        key={key}
                        {...optionProps}
                    >
                        <ListItemIcon>
                            <Icon sx={{ color: colors[colorName][colorShade] }}>{option.icon}</Icon>
                        </ListItemIcon>
                        <ListItemText primary={option.label} />
                    </ListItem>
                );
            }}
            {...props}
            sx={{
                flex: 1,
                ...props.sx
            }}
        />
    )
}
