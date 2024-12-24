import { useContext, useState } from "react";
import CategoryAutocomplete, { CategoryAutocompleteProps } from "./CategoryAutocomplete";
import { autocompleteClasses, AutocompleteCloseReason, Box, ButtonBase, ClickAwayListener, InputBase, Link, Popover, Popper, Stack, styled, TextField, Typography } from "@mui/material";
import { Close, Done, Settings } from "@mui/icons-material";
import { Category } from "@/types/schema";
import CategoryChip from "../icon/CategoryChip";
import { JournalContext } from "@/contexts/JournalContext";
import AvatarIcon from "../icon/AvatarIcon";

type CategorySelectorProps = Omit<CategoryAutocompleteProps, 'renderInput'>

interface PopperComponentProps {
    anchorEl?: any;
    disablePortal?: boolean;
    open: boolean;
}

const StyledAutocompletePopper = styled('div')(({ theme }) => ({
    [`& .${autocompleteClasses.paper}`]: {
        boxShadow: 'none',
        margin: 0,
        color: 'inherit',
        fontSize: 13,
    },
    [`& .${autocompleteClasses.listbox}`]: {
        backgroundColor: '#fff',

        padding: 0,
        [`& .${autocompleteClasses.option}`]: {
            minHeight: 'auto',
            alignItems: 'flex-start',
            padding: 8,
            borderBottom: `1px solid  ${' #eaecef'}`,

            '&[aria-selected="true"]': {
                backgroundColor: 'transparent',
            },
            [`&.${autocompleteClasses.focused}, &.${autocompleteClasses.focused}[aria-selected="true"]`]:
            {
                backgroundColor: theme.palette.action.hover,
            },
            ...theme.applyStyles('dark', {
                borderBottom: `1px solid  ${'#30363d'}`,
            }),
        },
        ...theme.applyStyles('dark', {
            backgroundColor: '#1c2128',
        }),
    },
    [`&.${autocompleteClasses.popperDisablePortal}`]: {
        position: 'relative',
    },
}));

function PopperComponent(props: PopperComponentProps) {
    const { disablePortal, anchorEl, open, ...other } = props;
    return <StyledAutocompletePopper {...other} />;
}


const StyledPopper = styled(Popper)(({ theme }) => ({
    border: `1px solid ${'#e1e4e8'}`,
    boxShadow: `0 8px 24px ${'rgba(149, 157, 165, 0.2)'}`,
    color: '#24292e',
    backgroundColor: '#fff',
    borderRadius: 6,
    width: 300,
    zIndex: theme.zIndex.modal,
    fontSize: 13,
    ...theme.applyStyles('dark', {
        border: `1px solid ${'#30363d'}`,
        boxShadow: `0 8px 24px ${'rgb(1, 4, 9)'}`,
        color: '#c9d1d9',
        backgroundColor: '#1c2128',
    }),
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
    padding: 10,
    width: '100%',
    borderBottom: `1px solid ${'#30363d'}`,
    '& input': {
        borderRadius: 4,
        backgroundColor: '#fff',
        border: `1px solid ${'#30363d'}`,
        padding: 8,
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        fontSize: 14,
        '&:focus': {
            boxShadow: `0px 0px 0px 3px ${'rgba(3, 102, 214, 0.3)'}`,
            borderColor: '#0366d6',
            ...theme.applyStyles('dark', {
                boxShadow: `0px 0px 0px 3px ${'rgb(12, 45, 107)'}`,
                borderColor: '#388bfd',
            }),
        },
        ...theme.applyStyles('dark', {
            backgroundColor: '#0d1117',
            border: `1px solid ${'#eaecef'}`,
        }),
    },
    ...theme.applyStyles('dark', {
        borderBottom: `1px solid ${'#eaecef'}`,
    }),
}));

const Button = styled(ButtonBase)(({ theme }) => ({
    fontSize: 13,
    width: '100%',
    textAlign: 'left',
    paddingBottom: 8,
    color: '#586069',
    fontWeight: 600,
    '&:hover,&:focus': {
        color: '#0366d6',
        ...theme.applyStyles('dark', {
            color: '#58a6ff',
        }),
    },
    '& span': {
        width: '100%',
    },
    '& svg': {
        width: 16,
        height: 16,
    },
    ...theme.applyStyles('dark', {
        color: '#8b949e',
    }),
}));

export default function CategorySelector(props: CategorySelectorProps) {
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [searchValue, setSearchValue] = useState<string>('')
    const { getCategoriesQuery } = useContext(JournalContext)
    const value = props.value ?? []

    const selectedCategories: Category[] = value
        .map((categoryId) => getCategoriesQuery.data[categoryId])
        .filter(Boolean)

    const handleClose = () => {
        setAnchorEl(null);
    }

    const createCategoryWithValue = () => {
        //
    }

    return (
        <>
            <Button onClick={(event) => setAnchorEl(event.currentTarget)} sx={{ display: 'block', p: 1, m: -1 }}>
                <Stack direction='row' justifyContent={'space-between'} alignItems={'baseline'}>
                    <Typography component='span'>Category</Typography>
                    <Settings />
                </Stack>
            </Button>
            <Stack direction='row' alignItems='flex-start' gap={1} sx={{ flexWrap: 'wrap' }}>
                {selectedCategories.map((category) => {
                    return (
                        <CategoryChip key={category._id} icon contrast category={category} />
                    )
                })}
            </Stack>
            <StyledPopper
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                // onClose={() => setAnchorEl(null)}
                sx={{ width: '100%' }}
                placement='bottom-start'
            >
                <ClickAwayListener onClickAway={handleClose}>
                    <div>
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
                            noOptionsText={
                                <Link onClick={() => createCategoryWithValue()} sx={{ cursor: 'pointer' }}>Create new category &quot;{searchValue}&quot;</Link>
                            }
                            renderTags={() => null}
                            renderInput={(params) => (
                                <StyledInput
                                    ref={params.InputProps.ref}
                                    value={searchValue}
                                    onChange={(event) => setSearchValue(event.target.value)}
                                    inputProps={params.inputProps}
                                    autoFocus
                                    placeholder="Filter labels"
                                />
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
                    </div>
                </ClickAwayListener>
            </StyledPopper>
        </>
    )
}
