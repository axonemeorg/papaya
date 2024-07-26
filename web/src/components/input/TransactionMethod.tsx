import { CreditCard } from "@mui/icons-material";
import { Autocomplete, ListItem, ListItemIcon, ListItemText, Icon, TextField } from "@mui/material";
import { CSSProperties, useMemo } from "react";


interface IconWithGradientProps {
    icon: string;
    primaryColor: string;
    secondaryColor: string;
}

const IconWithGradient = (props: IconWithGradientProps) => {
    const { icon, primaryColor, secondaryColor } = props;

    return (
        <Icon
            style={{
                background: `-webkit-linear-gradient(left, ${primaryColor} 25%, ${secondaryColor} 75%)`,
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent',
            } as CSSProperties}
        >{icon}</Icon>
    )
}

const GradientOpenWithIcon = () => (
  <>
    
  </>
)

const EXAMPLE_TRANSACTION_METHODS = [
    {
        label: "Mastercard"
    }
]

export default function TransactionMethod() {
    const transactionMethodOptions = useMemo(() => {
        return EXAMPLE_TRANSACTION_METHODS.map((method) => {
            return {
                label: method.label
            }
        })
    }, [EXAMPLE_TRANSACTION_METHODS]);

    return (
        <Autocomplete
            options={transactionMethodOptions}
            sx={{ flex: 1 }}
            renderInput={(params) => <TextField {...params} label="Method" />}            
            renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                    <ListItem
                        dense
                        key={key}
                        // component="li"
                        // sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                        {...optionProps}
                    >
                        <ListItemIcon>
                            <IconWithGradient
                                icon='credit_card'
                                primaryColor="#EB001B"
                                secondaryColor="#F79E1B"
                            />
                        </ListItemIcon>
                        <ListItemText primary={option.label} />
                    </ListItem>
                );
            }}
        />
    )
}
