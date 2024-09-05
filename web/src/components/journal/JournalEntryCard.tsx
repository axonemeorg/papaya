import { JournalEntry } from "@/types/get";
import { Close, Delete, Edit, LocalPizza, MoreVert } from "@mui/icons-material";
import { Box, Icon, IconButton, Paper, Popover, Stack, Typography } from "@mui/material";
import CategoryIcon from "../icon/CategoryIcon";

interface JournalEntryCard {
    anchorEl: HTMLElement;
    onClose: () => void;
    entry: JournalEntry;
}

export default function JournalEntryCard(props: JournalEntryCard) {
    return (
        <Popover
            anchorEl={props.anchorEl}
            open={Boolean(props.anchorEl)}
            onClose={props.onClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <Stack gap={2} sx={{ minWidth: '400px' }}>
                <Box p={1}>
                    <Stack direction='row' justifyContent='flex-end' gap={0.5} sx={{ mb: 2 }}>
                        <IconButton size='small'><Edit fontSize="small"/></IconButton>
                        <IconButton size='small'><Delete fontSize="small" /></IconButton>
                        <IconButton size='small'><MoreVert fontSize="small" /></IconButton>
                        <IconButton size='small' sx={{ ml: 1 }} onClick={() => props.onClose()}>
                            <Close fontSize="small" />
                        </IconButton>
                    </Stack>
                    <Stack sx={{ textAlign: 'center' }} alignItems='center'>
                        <Typography variant='h3' mb={0.5}>$12.15</Typography>
                        <Stack direction='row' gap={1}>
                            <CategoryIcon category={props.entry.category} />
                            <Typography>{props.entry.memo}</Typography>
                        </Stack>
                    </Stack>
                </Box>
                <Paper square variant='outlined' sx={{ p: 2, borderLeft: 'none', borderRight: 'none', borderBottom: 'none' }}>
                    Hello
                </Paper>
            </Stack>
        </Popover>
    )
}
