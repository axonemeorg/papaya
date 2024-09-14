'use client'

import { Autocomplete, ListItem, ListItemIcon, ListItemText, Icon, TextField, AutocompleteProps, MenuItem } from "@mui/material";
import * as colors from '@mui/material/colors';
import { CSSProperties, useContext, useMemo } from "react";

import { type Category } from "@/types/get";
import { CategoryContext } from "@/contexts/CategoryContext";
import CategoryIcon from "../icon/CategoryIcon";

type CategoryAutocompleteProps = 
    & Omit<AutocompleteProps<Category, false, false, false>, 'options' | 'renderInput'>
    & Partial<Pick<AutocompleteProps<Category, false, false, false>, 'options' | 'renderInput'>>

export default function CategoryAutocomplete(props: CategoryAutocompleteProps) {
    const { categories } = useContext(CategoryContext);

    return (
        <Autocomplete<Category>
            options={categories}
            isOptionEqualToValue={(option, value) => option.categoryId === value.categoryId}
            renderInput={(params) => <TextField {...params} label="Category" />}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => {
                const { key, ...optionProps } = props;

                return (
                    <ListItem
                        dense
                        key={key}
                        {...optionProps}
                    >
                        <ListItemIcon>
                            <CategoryIcon category={option} />
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
