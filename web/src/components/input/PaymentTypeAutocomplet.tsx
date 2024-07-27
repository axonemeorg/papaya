import { PAYMENT_TYPE_NAMES, PaymentType } from "@/types/enum";
import { Autocomplete, ListItem, ListItemIcon, ListItemText, Icon, TextField, AutocompleteProps } from "@mui/material";
import { CSSProperties, useContext, useMemo } from "react";

type PaymentTypeAutocompleteProps = 
    & Omit<AutocompleteProps<PaymentType, false, false, false>, 'options'>
    & Partial<Pick<AutocompleteProps<PaymentType, false, false, false>, 'options'>>

export default function PaymentTypeAutocomplete(props: PaymentTypeAutocompleteProps) {
    return (
        <Autocomplete
            options={PaymentType.options}
            fullWidth
            renderInput={(params) => <TextField {...params} label="Payment Type" />}
            getOptionLabel={(option) => PAYMENT_TYPE_NAMES[option]}
            {...props}
        />
    )
}
