import { useContext, useState } from "react";
import CategoryAutocomplete, { CategoryAutocompleteProps } from "./CategoryAutocomplete";
import { AutocompleteCloseReason, Box, Button, Divider, InputBase, Popover, Stack, TextField } from "@mui/material";
import { Close, Done, Settings } from "@mui/icons-material";
import { Category } from "@/types/schema";
import CategoryChip from "../icon/CategoryChip";
import { JournalContext } from "@/contexts/JournalContext";
import AvatarIcon from "../icon/AvatarIcon";

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
                <Stack direction='row' alignItems='flex-start'>
                    {selectedCategories.map((category) => {
                        return (
                            <CategoryChip icon category={category} />
                        )
                    })}
                </Stack>
            </Stack>
            <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
                <Box>
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
                            <Box p={2}>
                                <TextField
                                    variant='outlined'
                                    ref={params.InputProps.ref}
                                    inputProps={params.inputProps}
                                    autoFocus
                                    placeholder="Category"
                                />
                            </Box>
                        )}
                        renderOption={(props, option, { selected }) => {
                            const { key, ...optionProps } = props
                            const category = getCategoriesQuery.data[option]

                            return (
                                <li key={key} {...optionProps}>
                                    <Box
                                        component={Done}
                                        sx={{ width: 17, height: 17, mr: '5px', ml: '-2px' }}
                                        style={{
                                            visibility: selected ? 'visible' : 'hidden',
                                        }}
                                    />
                                    <Box
                                        component="span"
                                        sx={{
                                            width: 14,
                                            height: 14,
                                            flexShrink: 0,
                                            borderRadius: '3px',
                                            mr: 1,
                                            mt: '2px',
                                        }}
                                        // style={{ backgroundColor: option.color }}
                                    />
                                    <Stack direction='row' gap={1}
                                        sx={(t) => ({
                                            flexGrow: 1,
                                            '& span': {
                                                // color: '#8b949e',
                                                // ...t.applyStyles('light', {
                                                //     color: '#586069',
                                                // }),
                                            },
                                        })}
                                    >
                                        <AvatarIcon avatar={category.avatar} />
                                        {category.label}
                                    </Stack>
                                    <Box
                                        component={Close}
                                        sx={{ opacity: 0.6, width: 18, height: 18 }}
                                        style={{
                                            visibility: selected ? 'visible' : 'hidden',
                                        }}
                                    />
                                </li>
                            );
                        }}
                        slots={{
                            popper: PopperComponent,
                            paper: (params) => <div {...params} />
                        }}
                    />
                </Box>
            </Popover>
        </>
    )
}
