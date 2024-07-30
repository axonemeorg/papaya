'use client'

import { Autocomplete, ListItem, ListItemIcon, ListItemText, Icon, TextField, AutocompleteProps } from "@mui/material";
import { CSSProperties, useContext, useMemo } from "react";

import { type Category } from "@/types/get";
import { CategoryContext } from "@/contexts/CategoryContext";

type CategoryAutocompleteProps = 
    & Omit<AutocompleteProps<Category, false, false, false>, 'options' | 'renderInput'>
    & Partial<Pick<AutocompleteProps<Category, false, false, false>, 'options' | 'renderInput'>>

export default function CategoryAutocomplete(props: CategoryAutocompleteProps) {
    const { categories } = useContext(CategoryContext);

    return (
        <Autocomplete
            options={categories}
            isOptionEqualToValue={(option, value) => option.categoryId === value.categoryId}
            renderInput={(params) => <TextField {...params} label="Category" />}
            getOptionLabel={(option) => option.label}
            {...props}
            sx={{
                flex: 1,
                ...props.sx
            }}
        />
    )
}
