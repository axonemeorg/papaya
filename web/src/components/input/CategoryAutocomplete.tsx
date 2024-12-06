'use client'

import { Autocomplete, ListItem, ListItemIcon, ListItemText, Icon, TextField, AutocompleteProps, MenuItem } from "@mui/material";

import AvatarIcon from "../icon/AvatarIcon";
import { Category } from "@/types/schema";
import { useContext } from "react";
import { JournalContext } from "@/contexts/JournalContext";

type CategoryAutocompleteProps = 
    & Omit<AutocompleteProps<Category['_id'], false, false, false>, 'options' | 'renderInput'>
    & Partial<Pick<AutocompleteProps<Category['_id'], false, false, false>, 'options' | 'renderInput'>>
    & { label?: string }

export default function CategoryAutocomplete(props: CategoryAutocompleteProps) {
    const { label, sx, ...rest } = props;

    const { getCategoriesQuery } = useContext(JournalContext);
    const { data, isLoading } = getCategoriesQuery;

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
                            <AvatarIcon category={category} />
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
