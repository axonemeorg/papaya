'use client'

import { TransactionMethodContext } from "@/contexts/TransactionMethodContext";
import { CreditCard } from "@mui/icons-material";
import { Autocomplete, ListItem, ListItemIcon, ListItemText, Icon, TextField, AutocompleteProps } from "@mui/material";
import { CSSProperties, useContext, useMemo } from "react";
import { type TransactionMethod } from "@/types/get";
import { IconWithGradient } from "../icon/IconWithGradient";



type TransactionMethodAutocompleteProps = 
    & Omit<AutocompleteProps<TransactionMethod, false, false, false>, 'options' | 'renderInput'>
    & Partial<Pick<AutocompleteProps<TransactionMethod, false, false, false>, 'options' | 'renderInput'>>

export default function TransactionMethodAutocomplete(props: TransactionMethodAutocompleteProps) {
    const { transactionMethods } = useContext(TransactionMethodContext);

    return (
        <Autocomplete
            options={transactionMethods}
            isOptionEqualToValue={(option, value) => option.transactionMethodId === value.transactionMethodId}
            renderInput={(params) => <TextField {...params} label="Method" />}
            renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                    <ListItem
                        dense
                        key={key}
                        {...optionProps}
                    >
                        <ListItemIcon>
                            <IconWithGradient
                                primaryColor="#EB001B"
                                secondaryColor="#F79E1B"
                            >
                                credit_card
                            </IconWithGradient>
                        </ListItemIcon>
                        <ListItemText primary={option.label} />
                    </ListItem>
                );
            }}
            getOptionLabel={(option) => option.label}
            {...props}
            sx={{
                flex: 1,
                ...props.sx
            }}
        />
    )
}
