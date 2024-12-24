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
import { useRef, useState } from "react";
import { Cancel, Search } from "@mui/icons-material";

type SearchModalProps = DialogProps & Pick<SearchLaunchButtonProps, 'placeholderText'>

export default function SearchModal(props: SearchModalProps) {
    const { placeholderText, ...rest } = props
    const [query, setQuery] = useState<string>('')
    const inputRef = useRef<HTMLInputElement>(null)
    const hasError = false

    const handleClear = () => {
        setQuery('')
        inputRef.current?.focus()
    }

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
                
            </DialogContent>
        </Dialog>
    )
}
