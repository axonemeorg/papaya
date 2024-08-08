import { CategoryContext } from "@/contexts/CategoryContext";
import { TransactionMethodContext } from "@/contexts/TransactionMethodContext";
import { Add } from "@mui/icons-material";
import { Box, Button, DialogTitle, Divider, ListItemIcon, ListItemText, MenuItem, MenuList } from "@mui/material";
import { useContext } from "react";
import { IconWithGradient } from "../input/TransactionMethodAutocomplete";


export default function ManageTransactionMethods() {
    const { transactionMethods } = useContext(TransactionMethodContext);

    return (
        <Box p={1}>
            <MenuList>
                {transactionMethods.map((transactionMethod) => (
                    <MenuItem key={transactionMethod.transactionMethodId}>
                      
                        <ListItemIcon>
                            <IconWithGradient
                                icon='credit_card'
                                primaryColor="#EB001B"
                                secondaryColor="#F79E1B"
                            />
                        </ListItemIcon>
                        <ListItemText primary={transactionMethod.label} />
                    </MenuItem>
                ))}
            </MenuList>
            <Divider sx={{ my: 1 }} />
            <Button startIcon={<Add />} fullWidth>Add</Button>
        </Box>
    )
}
