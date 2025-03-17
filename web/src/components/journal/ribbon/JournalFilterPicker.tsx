import { Add, FilterAlt, FilterAltOff } from "@mui/icons-material";
import { Button, IconButton, Stack, Typography } from "@mui/material";

export default function JournalFilterPicker() {
    return (
        <Stack direction='row' alignItems='center' gap={0.5}>
            <Button
                variant='text'
                sx={(theme) => ({
                    py: 0.75,
                    backgroundColor: theme.palette.action.hover,
                    '&:hover': {
                        backgroundColor: theme.palette.action.selected,
                    },
                })}
                // ref={dateViewPickerButtonRef}
                // onClick={() => setShowDateViewPicker((showing) => !showing)}
                color="inherit"
                startIcon={<FilterAlt fontSize='small' />}
                endIcon={<Add fontSize='small' />}
            >
                <Typography>
                    Filter
                </Typography>
            </Button>
            <IconButton>
                <FilterAltOff fontSize='small' />
            </IconButton>
        </Stack>
    )
}
