import { useContext, useState } from "react";
import CategoryAutocomplete, { CategoryAutocompleteProps } from "./CategoryAutocomplete";
import { 
    AutocompleteCloseReason,
    Button,
    ClickAwayListener,
    Divider,
    IconButton,
    InputBase,
    Link,
    ListItem,
    Paper,
    Popper,
    Stack,
    Typography
} from "@mui/material";
import { Close, Done, Settings } from "@mui/icons-material";
import { Category } from "@/types/schema";
import CategoryChip from "../icon/CategoryChip";
import { JournalContext } from "@/contexts/JournalContext";
import AvatarIcon from "../icon/AvatarIcon";
import { createCategory } from "@/database/actions";
import { DEFAULT_AVATAR } from "../pickers/AvatarPicker";

type CategorySelectorProps = Omit<CategoryAutocompleteProps, 'renderInput'>

export default function CategorySelector(props: CategorySelectorProps) {
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [searchValue, setSearchValue] = useState<string>('')
    const { getCategoriesQuery, journal } = useContext(JournalContext)
    const value = props.value ?? []

    const selectedCategories: Category[] = value
        .map((categoryId) => getCategoriesQuery.data[categoryId])
        .filter(Boolean)

    const handleClose = () => {
        setAnchorEl(null);
    }

    const createCategoryWithValue = async () => {
        if (!journal) {
            return
        }
        const journalId = journal._id
        await createCategory({
            label: searchValue,
            description: '',
            avatar: DEFAULT_AVATAR,
        }, journalId)
        getCategoriesQuery.refetch()
    }

    return (
        <>
            <Button
                onClick={(event) => setAnchorEl(event.currentTarget)}
                sx={(theme) => ({
                    mx: -1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left',
                    color: 'inherit',
                    fontWeight: 600,
                    '&:hover, &:focus': {
                        color: theme.palette.primary.main
                    },
                })}
            >
                <Typography component='span'>Category</Typography>
                <IconButton sx={{ m: -1, color: 'inherit' }} disableRipple>
                    <Settings />
                </IconButton>
            </Button>
            <Stack direction='row' alignItems='flex-start' gap={1} sx={{ flexWrap: 'wrap', mx: -0.5, mt: 0.5 }}>
                {selectedCategories.map((category) => {
                    return (
                        <CategoryChip key={category._id} icon contrast category={category} />
                    )
                })}
            </Stack>
            <Popper
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                sx={(theme) => ({ width: '300px', zIndex: theme.zIndex.modal})}
                placement='bottom-end'
            >
                <ClickAwayListener onClickAway={handleClose}>
                    <Paper>
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
                                <Link onClick={() => createCategoryWithValue()} sx={{ cursor: 'pointer' }}>
                                    Create new category &quot;{searchValue}&quot;
                                </Link>
                            }
                            renderTags={() => null}
                            renderInput={(params) => (
                                <>
                                    <InputBase
                                        sx={{ width: '100%', px: 2, py: 1 }}
                                        ref={params.InputProps.ref}
                                        value={searchValue}
                                        onChange={(event) => setSearchValue(event.target.value)}
                                        inputProps={params.inputProps}
                                        autoFocus
                                        placeholder="Filter labels"
                                    />
                                    <Divider />
                                </>
                            )}
                            renderOption={(props, option, { selected }) => {
                                const { key, ...optionProps } = props
                                const category = getCategoriesQuery.data[option]

                                return (
                                    <ListItem key={key} {...optionProps}>
                                        <Done
                                            sx={(theme) => ({
                                                width: 17,
                                                height: 17,
                                                mr: theme.spacing(1),
                                                visibility: selected ? 'visible' : 'hidden',
                                            })}
                                        />
                                        <Stack direction='row' sx={{ flexGrow: 1, gap: 1 }}>
                                            <AvatarIcon avatar={category.avatar} />
                                            {category.label}
                                        </Stack>
                                        <Close
                                            sx={{
                                                opacity: 0.6,
                                                width: 18,
                                                height: 18,
                                                visibility: selected ? 'visible' : 'hidden',
                                            }}
                                        />
                                    </ListItem>
                                );
                            }}
                            slots={{
                                popper: (params: any) => <div {...params} />,
                                paper: (params) => <div {...params} />,
                            }}
                        />
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </>
    )
}
