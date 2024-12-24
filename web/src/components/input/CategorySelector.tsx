import { useContext, useState } from "react";
import CategoryAutocomplete, { CategoryAutocompleteProps } from "./CategoryAutocomplete";
import { AutocompleteCloseReason, Box, ButtonBase, Popover, Stack, TextField, Typography } from "@mui/material";
import { Close, Done, Settings } from "@mui/icons-material";
import { Category } from "@/types/schema";
import CategoryChip from "../icon/CategoryChip";
import { JournalContext } from "@/contexts/JournalContext";
import AvatarIcon from "../icon/AvatarIcon";

type CategorySelectorProps = Omit<CategoryAutocompleteProps, 'renderInput'>

function PopperComponent(props: any) {
    const { disablePortal, anchorEl, open, ...other } = props;
    return <div {...other} />;
}

export default function CategorySelector(props: CategorySelectorProps) {
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const { getCategoriesQuery } = useContext(JournalContext)
    const value = props.value ?? []

    const selectedCategories: Category[] = value
        .map((categoryId) => getCategoriesQuery.data[categoryId])
        .filter(Boolean)

    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <>
            <ButtonBase onClick={(event) => setAnchorEl(event.currentTarget)} sx={{ display: 'block', p: 1, m: -1 }}>
                <Stack gap={1}>
                    <Stack direction='row' justifyContent={'space-between'} alignItems={'baseline'}>
                        <Typography component='span'>Category</Typography>
                        <Settings />
                    </Stack>
                    <Stack direction='row' alignItems='flex-start' gap={1} sx={{ flexWrap: 'wrap' }}>
                        {selectedCategories.map((category) => {
                            return (
                                <CategoryChip key={category._id} icon contrast category={category} />
                            )
                        })}
                    </Stack>
                </Stack>
            </ButtonBase>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                sx={{ width: '100%' }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <CategoryAutocomplete
                    {...props}
                    open
                    onClose={(
                        _event,
                        reason: AutocompleteCloseReason,
                    ) => {
                        if (reason === 'escape') {
                            handleClose();
                        }
                    }}
                    disableCloseOnSelect
                    noOptionsText='No categories'
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
                                    sx={{
                                        flexGrow: 1,
                                        '& span': {
                                            // color: '#8b949e',
                                            // ...t.applyStyles('light', {
                                            //     color: '#586069',
                                            // }),
                                        },
                                    }}
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
            </Popover>
        </>
    )
}
