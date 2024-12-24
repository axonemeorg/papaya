import {
    Dialog,
    DialogContent,
    DialogProps,
    Divider,
    Fade,
    Grow,
    IconButton,
    InputAdornment,
    InputBase,
    Stack,
} from "@mui/material";
import { SearchLaunchButtonProps } from "./SearchLaunchButton";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Cancel, Search } from "@mui/icons-material";
import { JournalContext } from "@/contexts/JournalContext";
import { getAllJournalObjects } from "@/database/actions";
import Fuse from "fuse.js";
import { flattenJournalObjects } from "@/utils/search";

type SearchModalProps = DialogProps & Pick<SearchLaunchButtonProps, 'placeholderText'>

const fuseOptions = {
	keys: ['memo'], // Fields to search in
	includeScore: true, // Include the score of how good each match is
	threshold: 0.2, // Tolerance for fuzzy matching
	minMatchCharLength: 2, // Minimum number of characters that must match
}

export default function SearchModal(props: SearchModalProps) {
    const { placeholderText, ...rest } = props
    const [query, setQuery] = useState<string>('')
    const inputRef = useRef<HTMLInputElement>(null)
    const fuseRef = useRef<Fuse<any> | null>(null)
    const journalContext = useContext(JournalContext)
    const hasError = false

    const handleClear = () => {
        setQuery('')
        inputRef.current?.focus()
    }

    const results = useMemo(() => {
        if (!query) {
            return []
        } else if (!fuseRef.current) {
            return []
        }

        return fuseRef.current.search(query).map((result) => result.item)
    }, [query])

    useEffect(() => {
        if (!journalContext.journal) {
            return
        }
        getAllJournalObjects(journalContext.journal._id).then((objects) => {
            const flattenedObjects = flattenJournalObjects(objects)
            fuseRef.current = new Fuse(flattenedObjects, fuseOptions)
        })
    }, [props.open, journalContext.journal])

    return (
        <Dialog
            {...rest}
            TransitionComponent={Fade}
            fullWidth
            maxWidth={false}
            PaperProps={{
                sx: {
                    position: 'absolute',
                    top: 16,
                    right: 0,
                    left: 0,
                    mt: 0.75,
                    mx: 16,
                    width: 'unset'
                }
            }}
        >
            <DialogContent sx={{ py: 0 }}>
                <Stack direction='row' gap={1} sx={{ py: 1, position: 'sticky', top: 0, zIndex: 2 }}>
                    <InputAdornment position='start'>
                        <Search />
                    </InputAdornment>
                    <InputBase
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        autoFocus
                        size='small'
                        placeholder={placeholderText ?? 'Search'}
                        fullWidth
                        inputProps={inputRef}
                        error={hasError}
                        sx={{ pb: 0 }}
                        slotProps={{
                            input: {
                                sx: {
                                    pb: 0,
                                }
                            }
                        }}
                        
                    />
                    <Grow in={query.length > 0}>
                        <InputAdornment position='end'>
                            <IconButton onClick={() => handleClear()}>
                                <Cancel fontSize="small"/>
                            </IconButton>
                        </InputAdornment>
                    </Grow>
                </Stack>
            </DialogContent>
            <Divider />
            <DialogContent>
                {results.map((result, index) => {
                    return (
                        <div key={index}>
                            {JSON.stringify(result)}
                        </div>
                    )
                })}
            </DialogContent>
        </Dialog>
    )
}
