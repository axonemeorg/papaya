import { TRANSACTION_TAG_LABELS } from "@/constants/transactionTags";
import { TransactionTag } from "@/types/enum";
import { Check, Close } from "@mui/icons-material";
import { Box, Checkbox, Divider, ListItemIcon, ListItemText, MenuItem, MenuList, Popover, Typography } from "@mui/material";

interface TransactionTagPicker {
    anchorEl: Element | null;
    value: TransactionTag[];
    onChange: (tags: TransactionTag[]) => void;
    onClose: () => void;
}

export default function TransactionTagPicker(props: TransactionTagPicker) {
    const { anchorEl, onClose } = props;
    const open = Boolean(anchorEl);

    const handleToggleTag = (tag: TransactionTag) => {
        if (props.value.includes(tag)) {
            props.onChange(props.value.filter((t) => t !== tag));
        } else {
            props.onChange([...props.value, tag]);
        }
    }

    return (
        <Popover
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
            }}
        >
            <Box p={2}>
                <Typography variant='body2'>Apply tags to this transaction</Typography>
            </Box>
            <Divider />
            <MenuList>
                {Object.entries(TRANSACTION_TAG_LABELS).map(([tag, details]) => {
                    const checked = props.value.includes(tag as TransactionTag);
                    return (
                        <MenuItem key={tag} onClick={() => handleToggleTag(tag as TransactionTag)}>
                            {/* {props.value.includes(tag as TransactionTag) && (
                                <ListItemIcon><Check /></ListItemIcon>
                            )} */}
                            <ListItemIcon>
                                <Checkbox checked={checked} />
                            </ListItemIcon>
                            <ListItemText primary={details.label} secondary={details.description} />
                            {/* {props.value.includes(tag as TransactionTag) && (
                                <Close />
                            )} */}
                        </MenuItem>
                        
                    );
                })}
            </MenuList>
        </Popover>
    )
}
