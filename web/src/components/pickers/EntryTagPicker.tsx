import { TRANSACTION_TAG_LABELS } from "@/constants/transactionTags";
import { getEntryTags } from "@/database/queries";
import { EntryTag } from "@/types/schema";
import { Check, Close } from "@mui/icons-material";
import { Box, Checkbox, Divider, ListItemIcon, ListItemText, MenuItem, MenuList, Popover, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

interface TransactionTagPicker {
    anchorEl: Element | null;
    value: EntryTag['_id'][];
    onChange: (tags: EntryTag['_id'][]) => void;
    onClose: () => void;
}

export default function EntryTagPicker(props: TransactionTagPicker) {
    const { anchorEl, onClose } = props;
    const open = Boolean(anchorEl);

    const handleToggleTag = (tagId: EntryTag['_id']) => {
        if (props.value.includes(tagId)) {
            props.onChange(props.value.filter((t) => t !== tagId));
        } else {
            props.onChange([...props.value, tagId]);
        }
    }

    const entryTagQuery = useQuery<Record<EntryTag['_id'], EntryTag>>({
        queryKey: ['entryTags'],
        queryFn: getEntryTags,
        initialData: {},
    });

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
                <Typography variant='body2'>Apply tags to this record</Typography>
            </Box>
            <Divider />
            <MenuList>
                {Object.values(entryTagQuery.data).map((entryTag) => {
                    const tagId = entryTag._id;
                    const checked = props.value.includes(tagId);

                    return (
                        <MenuItem key={entryTag._id} onClick={() => handleToggleTag(tagId)}>
                            {/* {props.value.includes(tag as EntryTag) && (
                                <ListItemIcon><Check /></ListItemIcon>
                            )} */}
                            <ListItemIcon>
                                <Checkbox checked={checked} />
                            </ListItemIcon>
                            <ListItemText primary={entryTag.label} secondary={entryTag.description} />
                            {/* {props.value.includes(tag as EntryTag) && (
                                <Close />
                            )} */}
                        </MenuItem>
                        
                    );
                })}
            </MenuList>
        </Popover>
    )
}
