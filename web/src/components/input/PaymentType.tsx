import { PAYMENT_TYPE_NAMES } from "@/types/enum";
import { Autocomplete, ListItem, ListItemIcon, ListItemText, Icon, TextField } from "@mui/material";
import { CSSProperties, useContext, useMemo } from "react";

const PAYMENT_TYPE_OPTIONS = Object.entries(PAYMENT_TYPE_NAMES).map(([value, label]) => {
    return {
        value,
        label
    }
});

export default function PaymentType() {

    return (
        <Autocomplete
            options={PAYMENT_TYPE_OPTIONS}
            fullWidth
            // sx={{ flex: 1 }}
            renderInput={(params) => <TextField {...params} label="Payment Type" />}            
            renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                    <ListItem
                        dense
                        key={key}
                        {...optionProps}
                    >
                        <ListItemText primary={option.label} />
                    </ListItem>
                );
            }}
        />
    )
}
