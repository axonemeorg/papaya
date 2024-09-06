import { CategoryContext } from "@/contexts/CategoryContext";
import { TransactionMethodContext } from "@/contexts/TransactionMethodContext";
import { Add } from "@mui/icons-material";
import { Box, Button, DialogTitle, Divider, ListItemIcon, ListItemText, MenuItem, MenuList } from "@mui/material";
import { useContext, useState } from "react";
import { IconWithGradient } from "../input/TransactionMethodAutocomplete";
import TransactionMethodModal from "../modal/TransactionMethodModal";
import { getMuiColor } from "../color/ColorPicker";


export default function ManageTransactionMethods() {
    const { transactionMethods } = useContext(TransactionMethodContext);
    const [showTransactionMethodModal, setShowTransactionMethodModal] = useState<boolean>(false);

    return (
        <>
            <TransactionMethodModal
                open={showTransactionMethodModal}
                onClose={() => setShowTransactionMethodModal(false)}
            />
            <Box>
                <MenuList>
                    {transactionMethods.map((transactionMethod) => (
                        <MenuItem key={transactionMethod.transactionMethodId}>
                        
                            <ListItemIcon>
                                <IconWithGradient
                                    icon={transactionMethod.iconContent}
                                    primaryColor={getMuiColor(transactionMethod.iconPrimaryColor)}
                                    secondaryColor={getMuiColor(transactionMethod.iconSecondaryColor ?? transactionMethod.iconPrimaryColor) }
                                />
                            </ListItemIcon>
                            <ListItemText primary={transactionMethod.label} />
                        </MenuItem>
                    ))}
                </MenuList>
                {/* <Divider sx={{ my: 1 }} /> */}
                <Box px={2}>
                    <Button
                        onClick={() => setShowTransactionMethodModal(true)}
                        startIcon={<Add />}
                        fullWidth
                    >Add</Button>
                </Box>
            </Box>
        </>
    )
}
