import { useContext, useRef, useState } from "react";
import { 
    Button,
    ButtonBase,
    Chip,
    IconButton,
    Link,
    Stack,
    Typography
} from "@mui/material";
import { Settings } from "@mui/icons-material";
import { EntryTag, ReservedTag } from "@/types/schema";
import { JournalContext } from "@/contexts/JournalContext";
import clsx from "clsx";
import { EntryTagAutocompleteProps } from "./EntryTagAutocomplete";
import { RESERVED_TAGS } from "@/constants/tags";
import { EntryTagPicker } from "../pickers/EntryTagPicker";

type EntryTagSelectorProps = Omit<EntryTagAutocompleteProps, 'renderInput'>

export default function EntryTagSelector(props: EntryTagSelectorProps) {
    const anchorRef = useRef<HTMLAnchorElement>(null);
    const [open, setOpen] = useState<boolean>(false)
    
    const { getEntryTagsQuery } = useContext(JournalContext)
    const value = props.value ?? []

    const options: Record<string, EntryTag | ReservedTag> = {
        ...RESERVED_TAGS,
        ...getEntryTagsQuery.data
    }

    const selectedEntryTags: (EntryTag | ReservedTag)[] = value
        .map((tagId) => options[tagId])
        .filter(Boolean)

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Stack gap={0.5}>
            <Button
                component='a'
                className={clsx({ '--open': open })}
                ref={anchorRef}
                onClick={() => setOpen(true)}
                sx={(theme) => ({
                    mx: -1,
                    mt: -2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    textAlign: 'left',
                    color: 'inherit',
                    '&:hover, &:focus, &:focus-within, &.--open': {
                        color: theme.palette.primary.main
                    },
                    background: 'none',
                })}
                disableRipple
                tabIndex={-1}
            >
                <Typography component='span' variant='body2' sx={{ fontWeight: 500 }}>Tags</Typography>
                <IconButton sx={{ m: -1, color: 'inherit' }} disableTouchRipple>
                    <Settings />
                </IconButton>
            </Button>
            {selectedEntryTags.length === 0 ? (
                <Typography sx={{ mt: -1 }} variant='body2' color='textSecondary'>
                    <span>No tags — </span>
                    <Link onClick={() => setOpen(true)}>Add one</Link>
                </Typography>
            ) : (
                <Stack direction='row' alignItems='flex-start' gap={1} sx={{ flexWrap: 'wrap', mx: -0.5 }}>
                    {selectedEntryTags.map((tag) => {
                        return (
                            <ButtonBase disableRipple onClick={() => setOpen(true)} key={tag._id}>
                                <Chip label={tag.label} />
                            </ButtonBase>
                        )
                    })}
                </Stack>
            )}
            <EntryTagPicker
                {...props}
                open={open}
                anchorEl={anchorRef.current}
                onClose={() => handleClose()}
            />
        </Stack>
    )
}
