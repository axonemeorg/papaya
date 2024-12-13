import { useContext, useState } from "react";
import CategoryAutocomplete, { CategoryAutocompleteProps } from "./CategoryAutocomplete";
import { AutocompleteCloseReason, Box, Button, Divider, InputBase, Popover, Stack, TextField } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { Category } from "@/types/schema";
import CategoryChip from "../icon/CategoryChip";
import { JournalContext } from "@/contexts/JournalContext";

type CategorySelectorProps = CategoryAutocompleteProps;

function PopperComponent(props: any) {
    const { disablePortal, anchorEl, open, ...other } = props;
    return <div {...other} />;
}

export default function CategorySelector(props: CategorySelectorProps) {
    const [anchorEl, setAnchorEl] = useState<any>(null);

    const { getCategoriesQuery } = useContext(JournalContext)

    const selectedCategories: Category[] = props.value && getCategoriesQuery.data[props.value]
        ? [getCategoriesQuery.data[props.value]]
        : []

    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <>
            <Stack gap={1}>
                <Button onClick={(event) => setAnchorEl(event.currentTarget)} sx={{ justifyContent: 'space-between' }}>
                    <span>Category</span>
                    <Settings />
                </Button>
                <Divider />
                <Stack direction='row' alignItems='flex-start'>
                    {selectedCategories.map((category) => {
                        return (
                            <CategoryChip icon category={category} />
                        )
                    })}
                </Stack>
            </Stack>
            <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
                <Box sx={{ p: 2 }}>
                    <CategoryAutocomplete
                        {...props}
                        open
                        onClose={(
                            event: React.ChangeEvent<{}>,
                            reason: AutocompleteCloseReason,
                        ) => {
                            if (reason === 'escape') {
                                handleClose();
                            }
                        }}
                        disableCloseOnSelect
                        renderTags={() => null}
                        renderInput={(params) => (
                            <TextField
                                variant='outlined'
                                ref={params.InputProps.ref}
                                inputProps={params.inputProps}
                                autoFocus
                                placeholder="Category"
                            />
                        )}
                        slots={{
                            popper: PopperComponent
                        }}
                    />
                </Box>
            </Popover>
        </>
    )
}
