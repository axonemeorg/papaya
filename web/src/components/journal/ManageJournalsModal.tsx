import { JournalContext } from "@/contexts/JournalContext";
import { JournalMeta } from "@/types/schema";
import { Person } from "@mui/icons-material";
import { Dialog, DialogContent, DialogContentText, Grid2 as Grid, ListItemIcon, ListItemText, MenuItem, MenuList } from "@mui/material";
import { useContext } from "react";
import JournalDetailsAndActivity from "./JournalDetailsAndActivity";

interface ManageJournalsModal {
    open: boolean;
    onClose: () => void;
}

export default function ManageJournalsModal(props: ManageJournalsModal) {
    const journalContext = useContext(JournalContext);

    const journals: JournalMeta[] = [
        {
            _id: '1',
            type: 'JOURNAL',
            journalName: 'Journal 1',
            journalVersion: 1,
            createdAt: new Date('2024-12-05').toISOString(),
            updatedAt: null,
            avatar: {
                variant: 'PICTORIAL',
                content: 'book',
                primaryColor: '#2196f3',
            },
        },
        {
            _id: '2',
            type: 'JOURNAL',
            journalName: 'Journal_old',
            journalVersion: 1,
            createdAt: new Date('2022-01-01').toISOString(),
            updatedAt: null,
            avatar: {
                variant: 'PICTORIAL',
                content: 'book',
                primaryColor: '#2196f3',
            },
        }
    ]

    return (
        <Dialog open={props.open} onClose={props.onClose} fullWidth>
            <Grid columns={12}>
                <Grid size={6}>
                    <DialogContent>
                        <DialogContentText>Please select a journal.</DialogContentText>
                    </DialogContent>
                    <MenuList>
                        {journals.map(journal => {
                            return (
                                <MenuItem key={journal._id}>
                                    <ListItemIcon>
                                        <Person />
                                    </ListItemIcon>
                                    <ListItemText primary={journal.journalName} />
                                </MenuItem>
                            );
                        })}
                    </MenuList>
                </Grid>
                <Grid size={6}>
                    <JournalDetailsAndActivity details={journals[0]} size={12} lastActivity="2024-12-05" activity={[]} />
                </Grid>
            </Grid>
        </Dialog>
    );
}
