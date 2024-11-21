'use client'

import { Autocomplete, ListItem, ListItemIcon, ListItemText, Icon, TextField, AutocompleteProps, MenuItem } from "@mui/material";

import CategoryIcon from "../icon/CategoryIcon";
// import { fetchCategoriesQuery } from "@/database/queries";
import { Category } from "@/types/schema";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/database/queries";

type CategoryAutocompleteProps = 
    & Omit<AutocompleteProps<Category['_id'], false, false, false>, 'options' | 'renderInput'>
    & Partial<Pick<AutocompleteProps<Category['_id'], false, false, false>, 'options' | 'renderInput'>>
    & { label?: string }

export default function CategoryAutocomplete(props: CategoryAutocompleteProps) {
    const { label, sx, ...rest } = props;

    const fetchCategoriesQuery = useQuery<Record<Category['_id'], Category>>({
        queryKey: ['categories'],
        initialData: {},
        queryFn: getCategories,
    });

    const { data, isLoading } = fetchCategoriesQuery;

    return (
        <Autocomplete<Category['_id']>
            loading={isLoading}
            options={Object.keys(data)}
            // isOptionEqualToValue={(option, value) => option._id === value}
            renderInput={(params) => <TextField {...params} label={label ?? "Category"} />}
            getOptionLabel={(option) => data[option]?.label}
            renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                const category = data[option];

                return (
                    <ListItem
                        dense
                        key={key}
                        {...optionProps}
                    >
                        <ListItemIcon>
                            <CategoryIcon category={category} />
                        </ListItemIcon>
                        <ListItemText primary={category?.label} />
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
