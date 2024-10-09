'use client'

import { Autocomplete, ListItem, ListItemIcon, ListItemText, Icon, TextField, AutocompleteProps, MenuItem } from "@mui/material";
import * as colors from '@mui/material/colors';
import { CSSProperties, useContext, useMemo } from "react";

import { type Category } from "@/types/get";
import CategoryIcon from "../icon/CategoryIcon";
import { useCategoryStore } from "@/store/useCategoriesStore";

type CategoryAutocompleteProps = 
    & Omit<AutocompleteProps<Category, false, false, false>, 'options' | 'renderInput'>
    & Partial<Pick<AutocompleteProps<Category, false, false, false>, 'options' | 'renderInput'>>
    & { label?: string }

export default function CategoryAutocomplete(props: CategoryAutocompleteProps) {
    const { label, sx, ...rest } = props;
    const categories = useCategoryStore((state) => state.categories)

    return (
        <Autocomplete<Category>
            options={categories}
            isOptionEqualToValue={(option, value) => option.categoryId === value.categoryId}
            renderInput={(params) => <TextField {...params} label={label ?? "Category"} />}
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
            {...rest}
            sx={{
                flex: 1,
                ...sx
            }}
        />
    )
}
